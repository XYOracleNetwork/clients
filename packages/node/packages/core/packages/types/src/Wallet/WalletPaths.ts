/* eslint-disable sort-keys-fix/sort-keys-fix */
const RootPath = "m/44'/60'/3'" as const

const ModulePath = {
  Archivist: `${RootPath}/1'` as const,
  Diviner: `${RootPath}/2'` as const,
  Node: `${RootPath}/0'` as const,
  Sentinel: `${RootPath}/3'` as const,
  Witness: `${RootPath}/4'` as const,
}

export const WALLET_PATHS = {
  Archivists: {
    AddressStateArchivist: `${ModulePath.Archivist}/1'` as const,
    Archivist: `${ModulePath.Archivist}/0'` as const,
    ImageThumbnailArchivist: `${ModulePath.Archivist}/2'` as const,
    ImageThumbnailDivinerIndexArchivist: `${ModulePath.Archivist}/3'` as const,
    NftMetadataArchivist: `${ModulePath.Archivist}/4'` as const,
  } as const,
  Diviners: {
    AddressHistory: `${ModulePath.Diviner}/1'` as const,
    AddressSpace: `${ModulePath.Diviner}/2'` as const,
    BoundWitness: `${ModulePath.Diviner}/3'` as const,
    AddressSpaceBatch: `${ModulePath.Diviner}/11'` as const,
    BoundWitnessStats: `${ModulePath.Diviner}/6'` as const,
    Diviner: `${ModulePath.Diviner}/0'` as const,
    Forecasting: `${ModulePath.Diviner}/10'` as const,
    ImageThumbnailBoundWitnessDiviner: `${ModulePath.Diviner}/15'` as const,
    LocationCertainty: `${ModulePath.Diviner}/9'` as const,
    ImageThumbnailDiviner: `${ModulePath.Diviner}/14'` as const,
    Payload: `${ModulePath.Diviner}/4'` as const,
    AddressStateBoundWitnessDiviner: `${ModulePath.Diviner}/19'` as const,
    PayloadStats: `${ModulePath.Diviner}/7'` as const,
    AddressStatePayloadDiviner: `${ModulePath.Diviner}/20'` as const,
    SchemaList: `${ModulePath.Diviner}/5'` as const,
    ImageThumbnailDivinerIndexBoundWitnessDiviner: `${ModulePath.Diviner}/17'` as const,
    ImageThumbnailDivinerIndexPayloadDiviner: `${ModulePath.Diviner}/18'` as const,
    SchemaStats: `${ModulePath.Diviner}/8'` as const,
    ImageThumbnailPayloadDiviner: `${ModulePath.Diviner}/16'` as const,
    NftCollectionScoreDiviner: `${ModulePath.Diviner}/13'` as const,
    NftMetadataIndexDiviner: `${ModulePath.Diviner}/21'` as const,
    NftScoreDiviner: `${ModulePath.Diviner}/12'` as const,
  } as const,
  Nodes: {
    ImageThumbnailNode: `${ModulePath.Node}/1'` as const,
    NftContractNode: `${ModulePath.Node}/2'` as const,
    Node: `${ModulePath.Node}/0'` as const,
  } as const,
  Sentinels: {
    ImageThumbnailSentinel: `${ModulePath.Sentinel}/1'` as const,
    NftContractInfoSentinel: `${ModulePath.Sentinel}/2'` as const,
    NftMetadataSentinel: `${ModulePath.Sentinel}/3'` as const,
    Sentinel: `${ModulePath.Sentinel}/0'` as const,
  } as const,
  Witnesses: {
    CryptoNftCollectionWitness: `${ModulePath.Witness}/3'` as const,
    CryptoWalletNftWitness: `${ModulePath.Witness}/2'` as const,
    ImageThumbnailWitness: `${ModulePath.Witness}/4'` as const,
    Prometheus: `${ModulePath.Witness}/1'` as const,
    TimestampWitness: `${ModulePath.Witness}/5'` as const,
    Witness: `${ModulePath.Witness}/0'` as const,
  } as const,
} as const
