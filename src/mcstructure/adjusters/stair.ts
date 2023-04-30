import { MappingData } from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { BlockModifier, CardinalDirection } from '../blockModifier'
import _ from 'lodash'
import { Adjuster } from '.'

type StairStates = {
  facing: CardinalDirection
  half: 'bottom' | 'top'
  shape:
    | 'inner_left'
    | 'inner_right'
    | 'outer_left'
    | 'outer_right'
    | 'straight'
  waterlogged: boolean
}
function isStair(
  block: Readonly<MappingData['pc']>,
): block is Readonly<{ name: string; states: StairStates }> {
  return block.name.includes('stairs')
}

const stairAdjuster: Adjuster = (target, adjacents) => {
  if (!isStair(target)) return null
  const facing = target.states.facing
  const relativeDirectionMappings =
    BlockModifier.getRelativeDirectionMappings(facing)

  const straightAdjacents = Object.values(
    _.pick(adjacents, [
      relativeDirectionMappings.left,
      relativeDirectionMappings.right,
    ]),
  )
  if (
    straightAdjacents.some(
      (adjacent) =>
        isStair(adjacent) &&
        adjacent.states.half === target.states.half &&
        adjacent.states.facing === target.states.facing,
    )
  ) {
    const modifiedBlock = _.cloneDeep(target)
    modifiedBlock.states.shape = 'straight'
    return modifiedBlock
  }

  const outerAdjacent = adjacents[relativeDirectionMappings['front']]
  if (
    outerAdjacent &&
    isStair(outerAdjacent) &&
    outerAdjacent.states.half === target.states.half
  ) {
    if (outerAdjacent.states.facing === relativeDirectionMappings['left']) {
      const modifiedBlock = _.cloneDeep(target)
      modifiedBlock.states.shape = 'outer_left'
      return modifiedBlock
    }
    if (outerAdjacent.states.facing === relativeDirectionMappings['right']) {
      const modifiedBlock = _.cloneDeep(target)
      modifiedBlock.states.shape = 'outer_right'
      return modifiedBlock
    }
  }

  const innerAdjacent = adjacents[relativeDirectionMappings['back']]
  if (
    innerAdjacent &&
    isStair(innerAdjacent) &&
    innerAdjacent.states.half === target.states.half
  ) {
    if (innerAdjacent.states.facing === relativeDirectionMappings['left']) {
      const modifiedBlock = _.cloneDeep(target)
      modifiedBlock.states.shape = 'inner_left'
      return modifiedBlock
    }
    if (innerAdjacent.states.facing === relativeDirectionMappings['right']) {
      const modifiedBlock = _.cloneDeep(target)
      modifiedBlock.states.shape = 'inner_right'
      return modifiedBlock
    }
  }

  const modifiedBlock = _.cloneDeep(target)
  modifiedBlock.states.shape = 'straight'
  return modifiedBlock
}

export default stairAdjuster
