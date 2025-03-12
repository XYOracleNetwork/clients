import type { ModuleManifest, PackageManifestPayload } from '@xyo-network/manifest-model'

import node from './node.json' with { type: 'json' }

/**
 * The default node
 */
export const defaultNode = node as PackageManifestPayload

// Public children
export const manifestPublicChildren = [] as ModuleManifest[]
