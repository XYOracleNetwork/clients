import { NftCollectionScoreDiviner } from '@xyo-network/crypto-nft-collection-diviner-score-plugin'
import { NftScoreDiviner } from '@xyo-network/crypto-nft-diviner-score-plugin'
import { AddressHistoryDiviner } from '@xyo-network/diviner-address-history'
import { MemoryBoundWitnessDiviner } from '@xyo-network/diviner-boundwitness'
import { MemoryBoundWitnessStatsDiviner } from '@xyo-network/diviner-boundwitness-stats'
import type { ForecastingDivinerParams } from '@xyo-network/diviner-forecasting'
import { MemoryForecastingDiviner } from '@xyo-network/diviner-forecasting'
import { MemoryPayloadDiviner } from '@xyo-network/diviner-payload'
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
  locator.register(AddressHistoryDiviner)
  locator.register(ImageThumbnailStateToIndexCandidateDiviner)
  locator.register(ImageThumbnailIndexCandidateToImageThumbnailIndexDiviner)
  locator.register(ImageThumbnailQueryToImageThumbnailIndexQueryDiviner)
  locator.register(ImageThumbnailIndexQueryResponseToImageThumbnailQueryResponseDiviner)
  locator.register(ImageThumbnailDiviner)
  // locator.register(MemoryAddressSpaceDiviner)
  locator.register(MemoryBoundWitnessDiviner)
  locator.register(MemoryBoundWitnessStatsDiviner)
  locator.register(getMemoryForecastingDiviner())
  locator.register(MemoryPayloadDiviner)
  locator.register(MemoryPayloadStatsDiviner)
  locator.register(MemorySchemaListDiviner)
  locator.register(MemorySchemaStatsDiviner)
  locator.register(NftCollectionScoreDiviner)
  locator.register(NftScoreDiviner)
  locator.register(EvmCallDiviner)
  locator.register(TemporalIndexingDivinerDivinerQueryToIndexQueryDiviner)
  locator.register(TemporalIndexingDivinerIndexCandidateToIndexDiviner)
  locator.register(TemporalIndexingDivinerIndexQueryResponseToDivinerQueryResponseDiviner)
  locator.register(TemporalIndexingDivinerStateToIndexCandidateDiviner)
  locator.register(TemporalIndexingDiviner)
}
