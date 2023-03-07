declare module 'prismarine-schematic/lib/states' {
  import MinecraftData from 'minecraft-data'

  function getStateId(
    mcData: MinecraftData.IndexedData,
    name: string,
    properties: [string, string][],
  ): number
}
