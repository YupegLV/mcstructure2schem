declare module 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json' {
  interface MappingData {
    pc: {
      name: string
      states: { [k: string]: string | number | boolean }
    }
    pe: {
      name: string
      states: { [k: string]: string | number }
    }
  }

  const data: MappingData[]

  export default data
}
