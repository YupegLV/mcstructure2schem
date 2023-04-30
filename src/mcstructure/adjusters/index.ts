import { MappingData } from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { BlockModifier, Direction } from '../blockModifier'
import stairAdjuster from './stair'

export type Adjuster = (
  target: Readonly<MappingData['pc']>,
  adjacents: { [dir in Direction]?: Readonly<MappingData['pc']> },
) => MappingData['pc'] | null

const adjusters: Adjuster[] = [stairAdjuster]

function adjustStates(modifier: BlockModifier) {
  for (let x = 0; x < modifier.size.x; x++) {
    for (let y = 0; y < modifier.size.y; y++) {
      for (let z = 0; z < modifier.size.z; z++) {
        const target = modifier.getBlock(x, y, z)
        const adjucents = modifier.getAdjacentBlocks(x, y, z)
        for (const adjuster of adjusters) {
          const modified = adjuster(target, adjucents)
          if (modified) modifier.setBlock(x, y, z, modified)
        }
      }
    }
  }
}

export default adjustStates
