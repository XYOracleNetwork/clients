import type { InfuraProviderConfig } from './InfuraProviderConfig.ts'
import type { PocketProviderConfig } from './PocketProviderConfig.ts'

export interface ProviderOptions {
  alchemy?: string // Alchemy API Token
  etherscan?: string // Etherscan API Token
  infura?: InfuraProviderConfig | string // INFURA Project ID or { projectId, projectSecret }
  pocket?: PocketProviderConfig | string // Pocket Network Application ID or { applicationId, applicationSecretKey }
  quicknode?: string // QuickNode API Token
  quorum?: number // The number of backends that must agree (default: 2 for mainnet, 1 for testnets)
}
