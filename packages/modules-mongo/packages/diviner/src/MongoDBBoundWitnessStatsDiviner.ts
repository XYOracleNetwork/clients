import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { Address } from '@xylabs/hex'
import { fulfilled, rejected } from '@xylabs/promise'
import { AddressPayload, AddressSchema } from '@xyo-network/address-payload-plugin'
import { BoundWitnessStatsDiviner } from '@xyo-network/diviner-boundwitness-stats-abstract'
import {
  asDivinerInstance,
  AttachableDivinerInstance,
  BoundWitnessStatsDivinerConfigSchema,
  BoundWitnessStatsDivinerSchema,
  BoundWitnessStatsPayload,
  BoundWitnessStatsQueryPayload,
  DivinerParams,
  isBoundWitnessStatsQueryPayload,
} from '@xyo-network/diviner-models'
import { COLLECTIONS, DATABASES, MongoDBModuleMixin } from '@xyo-network/module-abstract-mongodb'
import { TYPES } from '@xyo-network/node-core-types'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, Schema, WithMeta, WithSources } from '@xyo-network/payload-model'
import { BoundWitnessWithMongoMeta } from '@xyo-network/payload-mongodb'
import { MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { Job, JobProvider } from '@xyo-network/shared'
import { ChangeStream, ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { defineJobs, scheduleJobs } from './JobQueue'
import { SetIterator } from './SetIterator'

const updateOptions: UpdateOptions = { upsert: true }

interface Stats {
  address: string
  bound_witnesses?: {
    count?: number
  }
}

const MongoDBDivinerBase = MongoDBModuleMixin(BoundWitnessStatsDiviner)

const moduleName = 'MongoDBBoundWitnessStatsDiviner'

export class MongoDBBoundWitnessStatsDiviner
  extends MongoDBDivinerBase<DivinerParams, BoundWitnessStatsQueryPayload, BoundWitnessStatsPayload>
  implements
    BoundWitnessStatsDiviner<DivinerParams, BoundWitnessStatsQueryPayload, BoundWitnessStatsPayload>,
    AttachableDivinerInstance<DivinerParams, BoundWitnessStatsQueryPayload, BoundWitnessStatsPayload>,
    JobProvider
{
  static override configSchemas: Schema[] = [...super.configSchemas, BoundWitnessStatsDivinerConfigSchema]
  static override defaultConfigSchema: Schema = BoundWitnessStatsDivinerConfigSchema

  /**
   * Iterates over know addresses obtained from AddressDiviner
   */
  protected readonly addressIterator: SetIterator<Address> = new SetIterator([])

  /**
   * The interval at which the background divine task will run. Prevents
   * continuously iterating over DB and exhausting DB resources
   */
  protected readonly backgroundDivineIntervalMs = 250

  /**
   * A reference to the background task to ensure that the
   * continuous background divine stays running
   */
  protected backgroundDivineTask: Promise<void> | undefined

  protected changeStream: ChangeStream | undefined = undefined
  protected pendingCounts: Record<string, number> = {}
  protected resumeAfter: ResumeToken | undefined = undefined

  get jobs(): Job[] {
    return [
      {
        name: `${moduleName}.UpdateChanges`,
        onSuccess: () => {
          this.pendingCounts = {}
        },
        schedule: '1 minute',
        task: async () => await this.updateChanges(),
      },
      {
        name: `${moduleName}.DivineAddressesBatch`,
        schedule: '5 minute',
        task: async () => await this.divineAddressesBatch(),
      },
    ]
  }

  protected override async divineHandler(payloads?: Payload[]): Promise<Payload<BoundWitnessStatsPayload>[]> {
    const query = payloads?.find<BoundWitnessStatsQueryPayload>(isBoundWitnessStatsQueryPayload)
    const addresses =
      query?.address ?
        Array.isArray(query?.address) ?
          query.address
        : [query.address]
      : undefined
    const counts = addresses ? await Promise.all(addresses.map((address) => this.divineAddress(address))) : [await this.divineAllAddresses()]
    return await Promise.all(
      counts.map(
        async (count) => await new PayloadBuilder<BoundWitnessStatsPayload>({ schema: BoundWitnessStatsDivinerSchema }).fields({ count }).build(),
      ),
    )
  }

  protected override async startHandler() {
    await super.startHandler()
    await this.ensureIndexes()
    await this.registerWithChangeStream()
    defineJobs(this.jobQueue, this.jobs)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.jobQueue.once('ready', async () => await scheduleJobs(this.jobQueue, this.jobs))
    return true
  }

  protected override async stopHandler() {
    await this.changeStream?.close()
    return await super.stopHandler()
  }

  private backgroundDivine = async (): Promise<void> => {
    for (const address of this.addressIterator) {
      try {
        await this.divineAddressFull(address)
      } catch (error) {
        this.logger?.error(`${moduleName}.BackgroundDivine: ${error}`)
      }
      await delay(this.backgroundDivineIntervalMs)
    }
    this.backgroundDivineTask = undefined
  }

  private divineAddress = async (address: Address) => {
    const stats = await this.boundWitnesses.useMongo(async (mongo) => {
      return await mongo.db(DATABASES.Archivist).collection<Stats>(COLLECTIONS.ArchivistStats).findOne({ address: address })
    })
    const remote = stats?.bound_witnesses?.count || 0
    const local = this.pendingCounts[address] || 0
    return remote + local
  }

  private divineAddressFull = async (address: Address) => {
    const count = await this.boundWitnesses.useCollection((collection) => collection.countDocuments({ addresses: { $in: [address] } }))
    await this.storeDivinedResult(address, count)
    return count
  }

  private divineAddressesBatch = async () => {
    this.logger?.log(`${moduleName}.DivineAddressesBatch: Updating Addresses`)
    const addressSpaceDiviners = await this.upResolver.resolve({ name: [assertEx(TYPES.AddressSpaceDiviner)] })
    const addressSpaceDiviner = asDivinerInstance(addressSpaceDiviners.pop(), `${moduleName}.DivineAddressesBatch: Missing AddressSpaceDiviner`)
    const result = (await addressSpaceDiviner.divine([])) || []
    const addresses = result.filter((x): x is WithSources<WithMeta<AddressPayload>> => x.schema === AddressSchema).map((x) => x.address)
    const additions = this.addressIterator.addValues(addresses)
    this.logger?.log(`${moduleName}.DivineAddressesBatch: Incoming Addresses Total: ${addresses.length} New: ${additions}`)
    if (addresses.length > 0 && !this.backgroundDivineTask) this.backgroundDivineTask = this.backgroundDivine()
    this.logger?.log(`${moduleName}.DivineAddressesBatch: Updated Addresses`)
  }

  private divineAllAddresses = () => this.boundWitnesses.useCollection((collection) => collection.estimatedDocumentCount())

  private processChange = (change: ChangeStreamInsertDocument<BoundWitnessWithMongoMeta>) => {
    this.resumeAfter = change._id
    const addresses = change?.fullDocument?.addresses
    for (const address of addresses) {
      if (address) this.pendingCounts[address] = (this.pendingCounts[address] || 0) + 1
    }
  }

  private registerWithChangeStream = async () => {
    this.logger?.log(`${moduleName}.RegisterWithChangeStream: Registering`)
    const wrapper = MongoClientWrapper.get(this.boundWitnesses.uri, this.boundWitnesses.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, () => `${moduleName}.RegisterWithChangeStream: Connection failed`)
    const collection = connection.db(DATABASES.Archivist).collection(COLLECTIONS.BoundWitnesses)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    this.changeStream = collection.watch([], opts)
    this.changeStream.on('change', this.processChange)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.changeStream.on('error', this.registerWithChangeStream)
    this.logger?.log(`${moduleName}.RegisterWithChangeStream: Registered`)
  }

  private storeDivinedResult = async (address: string, count: number) => {
    await this.boundWitnesses.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ address }, { $set: { [`${COLLECTIONS.BoundWitnesses}.count`]: count } }, updateOptions)
    })
    this.pendingCounts[address] = 0
  }

  private updateChanges = async () => {
    this.logger?.log(`${moduleName}.UpdateChanges: Updating`)
    const updates = Object.keys(this.pendingCounts).map((address) => {
      const count = this.pendingCounts[address]
      this.pendingCounts[address] = 0
      const $inc = { [`${COLLECTIONS.BoundWitnesses}.count`]: count }
      return this.boundWitnesses.useMongo(async (mongo) => {
        await mongo.db(DATABASES.Archivist).collection(COLLECTIONS.ArchivistStats).updateOne({ address }, { $inc }, updateOptions)
      })
    })
    const results = await Promise.allSettled(updates)
    const succeeded = results.filter(fulfilled).length
    const failed = results.filter(rejected).length
    this.logger?.log(`${moduleName}.UpdateChanges: Updated - Succeeded: ${succeeded} Failed: ${failed}`)
  }
}
