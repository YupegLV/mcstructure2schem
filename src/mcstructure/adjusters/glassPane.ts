import { MappingData } from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { CardinalDirection } from '../blockModifier'
import _ from 'lodash'
import { Adjuster } from '.'

type GlassPane = {
  name: string
  states: {
    north: boolean
    south: boolean
    west: boolean
    east: boolean
    waterlogged: boolean
  }
}

function isGlassPane(
  block: Readonly<MappingData['pc']>,
): block is Readonly<GlassPane> {
  return block.name.includes('glass_pane')
}

const glassPaneAdjuster: Adjuster = (target, adjacents) => {
  if (!isGlassPane(target)) return null

  const modifiedBlock = _.cloneDeep(target)
  const cardinalDirections: CardinalDirection[] = [
    'north',
    'south',
    'west',
    'east',
  ]
  for (const dir of cardinalDirections) {
    const adjacent = adjacents[dir]
    modifiedBlock['states'][dir] =
      adjacent && adjacent.name !== 'air' ? true : false
  }
  return modifiedBlock
}

export default glassPaneAdjuster
