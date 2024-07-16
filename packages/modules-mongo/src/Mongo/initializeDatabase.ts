import { addIndexes } from './Indexes/index.js'

export const initializeDatabase = async () => {
  await addIndexes()
}
