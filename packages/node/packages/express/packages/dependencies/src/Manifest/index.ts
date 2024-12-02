import type { PackageManifestPayload } from '@xyo-network/manifest-model'

import node from './node.json' assert { type: 'json' }

/**
 * The default node
 */
export const defaultNode = node as PackageManifestPayload
