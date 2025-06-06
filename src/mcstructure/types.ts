type BlockInfo = {
  name: string
  states: { [k: string]: string | number }
  version: number
}

type McStructure = {
  size: [number, number, number]
  structure: {
    block_indices: [number[], number[]]
    netease_block_indices?: [number[], number[]]
    netease_bit_count?: number
    palette: {
      default: {
        block_palette: BlockInfo[]
      }
    }
  }
}

export { BlockInfo, McStructure }
