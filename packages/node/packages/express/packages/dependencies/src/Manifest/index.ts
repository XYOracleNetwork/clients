import { PackageManifestPayload } from '@xyo-network/manifest-model'

import node from './node.json'
import { imageThumbnailNode, nftContractNode, nftMetadataNode } from './PublicChildren'

/**
 * The default node
 */
export const defaultNode = node as PackageManifestPayload

/**
 * The public children of the node
 */
export const publicChildren: PackageManifestPayload[] = [imageThumbnailNode, nftContractNode, nftMetadataNode]

export { imageThumbnailNode, nftContractNode, nftMetadataNode } from './PublicChildren'
