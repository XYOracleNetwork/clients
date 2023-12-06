import { PackageManifestPayload } from '@xyo-network/manifest-model'

import imageThumbnailNodeManifest from './imageThumbnailNode.json'
import nftContractNodeManifest from './nftContractNode.json'
import nftIndexNodeManifest from './nftIndexNode.json'

export const imageThumbnailNode = imageThumbnailNodeManifest as PackageManifestPayload
export const nftContractNode = nftContractNodeManifest as PackageManifestPayload
export const nftWitnessIndexNode = nftIndexNodeManifest as PackageManifestPayload
