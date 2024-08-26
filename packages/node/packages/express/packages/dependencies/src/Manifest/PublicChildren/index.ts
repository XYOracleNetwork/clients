import type { PackageManifestPayload } from '@xyo-network/manifest-model'

import imageThumbnailNodeManifest from './imageThumbnailNode.json'
import nftContractNodeManifest from './nftContractNode.json'
import nftMetadataNodeManifest from './NftMetadataUriToNftMetadata.json'

export const imageThumbnailNode = imageThumbnailNodeManifest as PackageManifestPayload
export const nftContractNode = nftContractNodeManifest as PackageManifestPayload
export const nftMetadataNode = nftMetadataNodeManifest as PackageManifestPayload
