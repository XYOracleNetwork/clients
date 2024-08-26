import type { Archivist } from '@xyo-network/archivist-model'
import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { AbstractModule } from '@xyo-network/module-abstract'

export type BoundWitnessArchivist = Archivist<BoundWitness, BoundWitness, BoundWitness, string> & AbstractModule
