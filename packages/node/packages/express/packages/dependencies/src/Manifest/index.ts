import type { ModuleManifest, PackageManifestPayload } from '@xyo-network/manifest-model'

import chain from './chain.json' assert { type: 'json' }
import node from './node.json' assert { type: 'json' }

/**
 * The default node
 */
export const defaultNode = node as PackageManifestPayload

// Public children
const chainManifest = chain as PackageManifestPayload
export const manifestPublicChildren = [...chainManifest.nodes] as ModuleManifest[]
