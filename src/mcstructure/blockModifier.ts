import { Vec3 } from 'vec3'
import _ from 'lodash'
import { MappingData } from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'

type CardinalDirection = 'north' | 'south' | 'west' | 'east'
type Direction = CardinalDirection | 'up' | 'down'

class BlockModifier {
  constructor(
    public palette: Readonly<MappingData['pc']>[],
    public indices: number[],
    public size: Vec3,
  ) {}

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
}

export { BlockModifier, CardinalDirection }
