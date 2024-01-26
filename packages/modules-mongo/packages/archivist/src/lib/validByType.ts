import { QueryBoundWitnessWrapper } from '@xyo-network/boundwitness-builder'
import { isBoundWitness, isQueryBoundWitness } from '@xyo-network/boundwitness-model'
import { BoundWitnessWrapper } from '@xyo-network/boundwitness-wrapper'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

export const validByType = async (payloads: Payload[] = []) => {
  const results: [BoundWitnessWrapper[], PayloadWrapper[]] = [[], []]
  await Promise.all(
    payloads.map(async (payload) => {
      if (isBoundWitness(payload)) {
        const wrapper = isQueryBoundWitness(payload) ? QueryBoundWitnessWrapper : BoundWitnessWrapper
        const bw = await wrapper.parse(payload)
        if (await bw.getValid()) {
          results[0].push(bw)
        }
      } else {
        const payloadWrapper = await PayloadWrapper.wrap(payload)
        if (await payloadWrapper.getValid()) {
          results[1].push(payloadWrapper)
        }
      }
    }),
  )
  return results
}
