import { BoundWitness } from '@xyo-network/boundwitness-model'
import { WithMeta } from '@xyo-network/payload-model'

// NOTE: Could use lodash.pick with the following array but
// destructuring, like we are below, is most likely more performant
// const scrubbedFields = ['_signatures', 'addresses', 'payload_hashes', 'payload_schemas', 'previous_hashes', 'schema', 'timestamp']

export const scrubBoundWitnesses = (boundWitnesses: WithMeta<BoundWitness>[]) => {
  return boundWitnesses?.map((boundWitness) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $hash, $meta, addresses, payload_hashes, payload_schemas, previous_hashes, schema, ...props } = boundWitness
    return { $hash, $meta, addresses, payload_hashes, payload_schemas, previous_hashes, schema } as WithMeta<BoundWitness>
  })
}
