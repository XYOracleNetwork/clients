import { NftCollectionScoreDiviner } from '@xyo-network/crypto-nft-collection-diviner-score-plugin'
import { NftScoreDiviner } from '@xyo-network/crypto-nft-diviner-score-plugin'
import { AddressHistoryDiviner } from '@xyo-network/diviner-address-history'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness'
import { MemoryBoundWitnessStatsDiviner } from '@xyo-network/diviner-boundwitness-stats'
import type { ForecastingDivinerParams } from '@xyo-network/diviner-forecasting'
import { MemoryForecastingDiviner } from '@xyo-network/diviner-forecasting'
import { GenericPayloadDiviner } from '@xyo-network/diviner-payload'
import { MemoryPayloadStatsDiviner } from '@xyo-network/diviner-payload-stats'
import { MemorySchemaListDiviner } from '@xyo-network/diviner-schema-list'
import { MemorySchemaStatsDiviner } from '@xyo-network/diviner-schema-stats'
import {
  TemporalIndexingDiviner,
  TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner,
  TemporalIndexingDivinerIndexCandidateToIndexDiviner,
  TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner,
  TemporalIndexingDivinerStateToIndexCandidateDiviner,
} from '@xyo-network/diviner-temporal-indexing'
import { EvmCallDiviner } from '@xyo-network/evm-call-witness'
import {
  ImageThumbnailDiviner,
  ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner,
  ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner,
  ImageThumbnailQueryToImageThumbnailIndexQueryDiviner,
  ImageThumbnailStateToIndexCandidateDiviner,
} from '@xyo-network/image-thumbnail-plugin'
import type { ModuleFactoryLocator } from '@xyo-network/module-factory-locator'
import { ModuleFactory } from '@xyo-network/module-model'
import { TYPES } from '@xyo-network/node-core-types'
import type { Container } from 'inversify'

const getMemoryForecastingDiviner = () => {
  const forecastingMethod = 'arimaForecasting'
  const jsonPathExpression = '$.feePerGas.medium'
  const witnessSchema = 'network.xyo.blockchain.ethereum.gas'
  const params: ForecastingDivinerParams = {
    config: {
      // accountPath: WALLET_PATHS.Diviners.Forecasting,
      forecastingMethod,
      jsonPathExpression,
      name: TYPES.ForecastingDiviner,
      schema: MemoryForecastingDiviner.defaultConfigSchema,
      witnessSchema,
    },
  }
  return ModuleFactory.withParams(MemoryForecastingDiviner, params)
}

export const addDivinerModuleFactories = (container: Container) => {
  const locator = container.get<ModuleFactoryLocator>(TYPES.ModuleFactoryLocator)
  locator.register(AddressHistoryDiviner.factory())
  locator.register(ImageThumbnailStateToIndexCandidateDiviner.factory())
  locator.register(ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner.factory())
  locator.register(ImageThumbnailQueryToImageThumbnailIndexQueryDiviner.factory())
  locator.register(ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner.factory())
  locator.register(ImageThumbnailDiviner.factory())
  // locator.register(MemoryAddressSpaceDiviner)
  locator.register(MemoryBoundWitnessDiviner.factory())
  locator.register(MemoryBoundWitnessStatsDiviner.factory())
  locator.register(getMemoryForecastingDiviner())
  locator.register(GenericPayloadDiviner.factory())
  locator.register(MemoryPayloadStatsDiviner.factory())
  locator.register(MemorySchemaListDiviner.factory())
  locator.register(MemorySchemaStatsDiviner.factory())
  locator.register(NftCollectionScoreDiviner.factory())
  locator.register(NftScoreDiviner.factory())
  locator.register(EvmCallDiviner.factory())
  locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner.factory())
  locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner.factory())
  locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner.factory())
  locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner.factory())
  locator.register(TemporalIndexingDiviner.factory())
}
