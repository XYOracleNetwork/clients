/* eslint-disable max-statements */
import { readFile, writeFile } from 'node:fs/promises'

import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import type { ArchivistInstance } from '@xyo-network/archivist-model'
import { asArchivistInstance } from '@xyo-network/archivist-model'
import type {
  NftCollectionInfo,
  NftCollectionScore,
  NftCollectionWitnessQuery,
} from '@xyo-network/crypto-nft-collection-payload-plugin'
import {
  isNftCollectionInfo,
  isNftCollectionScore,
  NftCollectionWitnessQuerySchema,
} from '@xyo-network/crypto-nft-collection-payload-plugin'
import type { NftInfo } from '@xyo-network/crypto-nft-payload-plugin'
import { isNftInfo } from '@xyo-network/crypto-nft-payload-plugin'
import { asDivinerInstance } from '@xyo-network/diviner-model'
import { TYPES } from '@xyo-network/node-core-types'
import type { NodeInstance } from '@xyo-network/node-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { WithMeta, WithSources } from '@xyo-network/payload-model'
import type { UrlPayload } from '@xyo-network/url-payload-plugin'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import type { WitnessInstance } from '@xyo-network/witness-model'
import { asWitnessInstance } from '@xyo-network/witness-model'

import { collections } from './collections.js'

interface NftCollectionDisplaySlugInfo {
  displayName: string
  imageSlug: string | null
  score: Hash
}

type NftCollectionDisplaySlugInfos = Record<string, NftCollectionDisplaySlugInfo>

const maxNfts = 200_000

const filePath = './nftData/beta/nftCollectionDisplaySlugInfos.json'

export const witnessNftCollections = async (node: NodeInstance) => {
  const archivistMod = assertEx(await node.resolve(TYPES.Archivist), () => `Resolving: ${TYPES.Archivist}`)
  const archivist = assertEx(asArchivistInstance(archivistMod), () => `Creating: ${TYPES.Archivist}`)

  const nftCollectionScoreDivinerMod = assertEx(
    await node.resolve(TYPES.NftCollectionScoreDiviner),
    () => `Resolving: ${TYPES.NftCollectionScoreDiviner}`,
  )
  const nftCollectionScoreDiviner = assertEx(asDivinerInstance(nftCollectionScoreDivinerMod), () => `Creating: ${TYPES.NftCollectionScoreDiviner}`)

  const nftCollectionInfoWitnessMod = assertEx(
    await node.resolve(TYPES.CryptoNftCollectionWitness),
    () => `Resolving: ${TYPES.CryptoNftCollectionWitness}`,
  )
  const nftCollectionInfoWitness = assertEx(asWitnessInstance(nftCollectionInfoWitnessMod), () => `Creating: ${TYPES.CryptoNftCollectionWitness}`)

  const imageThumbnailWitnessMod = assertEx(await node.resolve(TYPES.ImageThumbnailWitness), () => `Resolving: ${TYPES.ImageThumbnailWitness}`)
  const imageThumbnailWitness = assertEx(asWitnessInstance(imageThumbnailWitnessMod), () => `Creating: ${TYPES.ImageThumbnailWitness}`)

  try {
    console.log('Getting NFT Collections')
    for (const [name, address, chainId] of collections) {
      console.log(`${address}(${name}): Beginning`)
      if (!address) {
        console.log(`${address}(${name}): Beginning: ERROR: No Address`)
        continue
      }
      try {
        console.log(`${address}(${name}): Collection History: Read Existing`)
        const nftCollectionDisplaySlugInfos: NftCollectionDisplaySlugInfos = await readCollectionInfo()
        const existingNftCollectionDisplaySlugInfo = nftCollectionDisplaySlugInfos[address]
        let imageSlug = nftCollectionDisplaySlugInfos?.[address]?.imageSlug
        let score = nftCollectionDisplaySlugInfos?.[address]?.score
        if (!score) {
          console.log(`${address}(${name}): Collection Info: Witness`)
          const nftCollectionInfoWitnessQuery: NftCollectionWitnessQuery = {
            address, chainId, maxNfts, schema: NftCollectionWitnessQuerySchema,
          }
          const nftCollectionInfoResult = await nftCollectionInfoWitness.observe([nftCollectionInfoWitnessQuery])
          const nftCollectionInfo = assertEx(
            nftCollectionInfoResult?.[0],
            () => `${address}(${name}): ERROR: Collection Info: Witness: Invalid length`,
          )
          console.log(`${address}(${name}): Collection Info: Store`)
          await archivist.insert([nftCollectionInfo])
          console.log(`${address}(${name}): Collection Score: Divine`)
          const nftCollectionScoreResult = await nftCollectionScoreDiviner.divine([nftCollectionInfo])
          const nftCollectionScore = assertEx(
            nftCollectionScoreResult?.[0],
            () => `${address}(${name}): ERROR: Collection Score: Divine: Invalid length`,
          )
          score = await PayloadBuilder.dataHash(nftCollectionScore)
          console.log(`${address}(${name}): Collection Score: Store`)
          await archivist.insert([nftCollectionScore])
        }
        console.log(`${address}(${name}): Collection Thumbnail: Generate`)
        imageSlug = await generateThumbnail(address, name, score, archivist, imageThumbnailWitness)
        console.log(`${address}(${name}): Collection Data: Persist Collection Data`)
        const updatedNftCollectionDisplaySlugInfo: NftCollectionDisplaySlugInfo = {
          displayName: name, imageSlug, score,
        }
        const nftCollectionDisplaySlugInfo: NftCollectionDisplaySlugInfo
          = existingNftCollectionDisplaySlugInfo
            ? { ...existingNftCollectionDisplaySlugInfo, ...updatedNftCollectionDisplaySlugInfo }
            : updatedNftCollectionDisplaySlugInfo
        nftCollectionDisplaySlugInfos[address] = nftCollectionDisplaySlugInfo
        await writeCollectionInfo(nftCollectionDisplaySlugInfos)
        console.log(`${address}(${name}): Collection Data: Collection Data Persisted`)
      } catch (error) {
        console.log(`${address}(${name}): ERROR`)
        console.log(error)
      }
    }
  } catch (error) {
    console.log('Error getting NFT collections')
    console.log(error)
  }
}

const readCollectionInfo = async (): Promise<NftCollectionDisplaySlugInfos> => {
  const fileContents = await readFile(filePath, 'utf8')
  const nftCollectionDisplaySlugInfos: NftCollectionDisplaySlugInfos = JSON.parse(fileContents)
  return nftCollectionDisplaySlugInfos
}
const writeCollectionInfo = async (nftCollectionDisplaySlugInfos: NftCollectionDisplaySlugInfos): Promise<void> => {
  await writeFile(filePath, JSON.stringify(sortObjectKeys(nftCollectionDisplaySlugInfos), null, 2))
}

const generateThumbnail = async (
  address: string,
  name: string,
  score: Hash,
  archivist: ArchivistInstance,
  imageThumbnailWitness: WitnessInstance,
): Promise<string | null> => {
  if (score) {
    console.log(`${address}(${name}): Collection Thumbnail: Obtain Candidate`)
    const nftCollectionScorePayload = assertEx(
      (await archivist.get([score])).find(isNftCollectionScore),
      () => 'ERROR: Collection Thumbnail: Obtain Score Payload',
    ) as WithSources<WithMeta<NftCollectionScore>>
    const nftCollectionInfoHash = assertEx(nftCollectionScorePayload.sources?.[0], () => 'ERROR: Collection Thumbnail: Obtain NFT Info Hash')
    const nftCollectionInfoPayload = (await archivist.get([nftCollectionInfoHash as Hash])).find(isNftCollectionInfo) as WithSources<
      WithMeta<NftCollectionInfo>
    >
    const nftInfoHash = assertEx(nftCollectionInfoPayload?.sources?.[0], () => 'ERROR: Collection Thumbnail: Obtain NFT Info Hash')
    const nftInfo = (await archivist.get([nftInfoHash as Hash])).find(isNftInfo) as WithSources<WithMeta<NftInfo>>
    if (typeof nftInfo?.metadata?.image === 'string') {
      const url = nftInfo.metadata.image
      const imageThumbnailWitnessQuery: UrlPayload = { schema: UrlSchema, url }
      try {
        console.log(`${address}(${name}): Collection Thumbnail: Witness`)
        const imageThumbnailResult = await imageThumbnailWitness.observe([imageThumbnailWitnessQuery])
        const imageThumbnail = assertEx(imageThumbnailResult?.[0], () => `${address}(${name}): ERROR: Collection Thumbnail: Witness: Invalid length`)
        console.log(`${address}(${name}): Collection Thumbnail: Store`)
        await archivist.insert([imageThumbnail])
        return await PayloadBuilder.dataHash(imageThumbnail)
      } catch (error) {
        console.log(`${address}(${name}): ERROR: Collection Thumbnail: ${error}`)
      }
    }
  }
  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dictionary = { [key: string]: any }
function sortObjectKeys(obj: Dictionary) {
  return (
    Object.keys(obj)
      .sort()
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((result, key) => {
        result[key] = obj[key]
        return result
      }, {} as Dictionary)
  )
}
