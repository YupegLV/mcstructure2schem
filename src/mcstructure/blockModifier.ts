import { Vec3 } from 'vec3'
import _ from 'lodash'
import blockMappings, {
  MappingData,
} from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { BlockInfo } from './types'
import minecraftData from 'minecraft-data'
import { getStateId } from 'prismarine-schematic/lib/states'

type CardinalDirection = 'north' | 'south' | 'west' | 'east'
type Direction = CardinalDirection | 'up' | 'down'

class BlockModifier {
  constructor(
    public palette: Readonly<MappingData['pc']>[],
    public indices: number[],
    public size: Vec3,
  ) {}

  static fromMcStructure(palette: BlockInfo[], indices: number[], size: Vec3) {
    const javaPalette = palette
      .map(({ name, ...others }) => ({
        name: name.replace('minecraft:', ''),
        ...others,
      }))
      .map(bedrock2java)
    const javaIndices = zyx2xzy(indices, size)
    return new BlockModifier(javaPalette, javaIndices, size)
  }

  getBlock(x: number, y: number, z: number) {
    const index =
      this.indices[x + z * this.size.x + y * this.size.x * this.size.z]
    return this.palette[index]
  }

  setBlock(x: number, y: number, z: number, block: MappingData['pc']) {
    let indexId = this.palette.findIndex((data) => _.isEqual(data, block))
    if (indexId === -1) {
      indexId = this.palette.push(block) - 1
    }
    this.indices[x + z * this.size.x + y * this.size.x * this.size.z] = indexId
  }

  getAdjacentBlocks(x: number, y: number, z: number) {
    const blocks: { [dir in Direction]?: MappingData['pc'] } = {}
    if (x + 1 < this.size.x) blocks['east'] = this.getBlock(x + 1, y, z)
    if (0 <= x - 1) blocks['west'] = this.getBlock(x - 1, y, z)
    if (y + 1 < this.size.y) blocks['up'] = this.getBlock(x, y + 1, z)
    if (0 <= y - 1) blocks['down'] = this.getBlock(x, y - 1, z)
    if (z + 1 < this.size.z) blocks['south'] = this.getBlock(x, y, z + 1)
    if (0 <= z - 1) blocks['north'] = this.getBlock(x, y, z - 1)
    return blocks
  }

  generateStateIdPalette(version: string) {
    const javaMcData = minecraftData(version)
    return this.palette.map((block) => {
      const stringizedStates = _.mapValues(block.states, _.toString)
      return getStateId(
        javaMcData,
        block.name,
        Object.entries(stringizedStates),
      )
    })
  }
}

function bedrock2java(bedrock: BlockInfo) {
  let javaBlock = blockMappings.find(
    (mapping) =>
      mapping.pe.name === bedrock.name &&
      Object.entries(mapping.pe.states).every(
        ([search_key, search_value]) =>
          bedrock.states[search_key] == search_value,
      ),
  )?.pc
  if (!javaBlock) {
    console.warn(
      `Unknown block ${bedrock.name}[${Object.entries(bedrock.states)
        .map((state) => state.join('='))
        .join(',')}] replacing with air`,
    )
    javaBlock = blockMappings[0].pc
  }
  return javaBlock
}

function zyx2xzy<T>(src: T[], size: Vec3) {
  const out: T[] = []
  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      for (let z = 0; z < size.z; z++) {
        out[x + z * size.x + y * size.x * size.z] =
          src[z + y * size.z + x * size.z * size.y]
      }
    }
  }
  return out
}

export { BlockModifier, CardinalDirection }
