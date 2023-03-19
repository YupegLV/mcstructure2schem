import nbt from 'prismarine-nbt'
import minecraftData from 'minecraft-data'
import blockMappings, {
  MappingData,
} from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { Schematic } from 'prismarine-schematic'
import { Vec3 } from 'vec3'
import { getStateId } from 'prismarine-schematic/lib/states'
import { BlockModifier, CardinalDirection } from './blockModifier'
import _ from 'lodash'

type BlockInfo = {
  name: string
  states: { [k: string]: string | number }
  version: number
}

type McStructure = {
  size: [number, number, number]
  structure: {
    block_indices: [number[], number[]]
    palette: {
      default: {
        block_palette: BlockInfo[]
      }
    }
  }
}

async function parseMcStructureBuffer(
  buffer: Buffer,
  version?: string,
  offset: Vec3 = new Vec3(0, 0, 0),
) {
  return parseMcStructure(
    await nbt.simplify((await nbt.parse(buffer)).parsed),
    version,
    offset,
  )
}

function parseMcStructure(
  structure: McStructure,
  version?: string,
  offset: Vec3 = new Vec3(0, 0, 0),
) {
  if (!version) {
    version = verNum2majorVer(
      structure.structure.palette.default.block_palette[0].version,
    )
  }
  const size = new Vec3(structure.size[0], structure.size[1], structure.size[2])
  const paletteData = structure.structure.palette.default.block_palette.map(
    (block) => bedrock2java(block.name.replace('minecraft:', ''), block.states),
  )
  const blocks = zyx2xzy(structure.structure.block_indices[0], size)
  const { adjustedPalette, adjustedBlocks } = adjustStates(
    version,
    size,
    paletteData,
    blocks,
  )

  return new Schematic(version, size, offset, adjustedPalette, adjustedBlocks)
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

function verNum2majorVer(version: number) {
  const versionArray: number[] = []
  for (let i = 0; i < 4; i++) {
    const shiftedVersion = version >> (8 * i)
    versionArray[i] = shiftedVersion & 0xff
  }
  return versionArray.reverse().slice(0, 2).join('.')
}

function bedrock2java(name: string, states: BlockInfo['states']) {
  let javaBlock = blockMappings.find(
    (mapping) =>
      mapping.pe.name === name &&
      Object.entries(mapping.pe.states).every(([search_key, search_value]) => {
        return states[search_key] == search_value
      }),
  )?.pc
  if (!javaBlock) {
    console.warn(
      `Unknown block ${name}[${Object.entries(states)
        .map((state) => state.join('='))
        .join(',')}] replacing with air`,
    )
    javaBlock = blockMappings[0].pc
  }
  return javaBlock
}

function adjustStates(
  version: string,
  size: Vec3,
  paletteData: MappingData['pc'][],
  blocks: number[],
) {
  const modifier = new BlockModifier(paletteData, blocks, size)

  function getRelativeDirections(facing: CardinalDirection): {
    front: CardinalDirection
    back: CardinalDirection
    left: CardinalDirection
    right: CardinalDirection
  } {
    switch (facing) {
      case 'north':
        return { front: 'north', back: 'south', left: 'west', right: 'east' }
      case 'south':
        return { front: 'south', back: 'north', left: 'east', right: 'west' }
      case 'west':
        return { front: 'west', back: 'east', left: 'south', right: 'north' }
      case 'east':
        return { front: 'east', back: 'west', left: 'north', right: 'south' }
    }
  }
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
    block: MappingData['pc'],
  ): block is Readonly<{ name: string; states: StairStates }> {
    return block.name.includes('stairs')
  }

  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      for (let z = 0; z < size.z; z++) {
        const target = modifier.getBlock(x, y, z)

        if (isStair(target)) {
          const facing = target.states.facing
          const adjacents = modifier.getAdjacentBlocks(x, y, z)
          const relativeDirections = getRelativeDirections(facing)

          const straightAdjacents = Object.values(
            _.pick(adjacents, [
              relativeDirections.left,
              relativeDirections.right,
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
            modifier.setBlock(x, y, z, modifiedBlock)
            continue
          }

          const outerAdjacent = adjacents[relativeDirections['front']]
          if (
            outerAdjacent &&
            isStair(outerAdjacent) &&
            outerAdjacent.states.half === target.states.half
          ) {
            if (outerAdjacent.states.facing === relativeDirections['left']) {
              const modifiedBlock = _.cloneDeep(target)
              modifiedBlock.states.shape = 'outer_left'
              modifier.setBlock(x, y, z, modifiedBlock)
              continue
            }
            if (outerAdjacent.states.facing === relativeDirections['right']) {
              const modifiedBlock = _.cloneDeep(target)
              modifiedBlock.states.shape = 'outer_right'
              modifier.setBlock(x, y, z, modifiedBlock)
              continue
            }
          }

          const innerAdjacent = adjacents[relativeDirections['back']]
          if (
            innerAdjacent &&
            isStair(innerAdjacent) &&
            innerAdjacent.states.half === target.states.half
          ) {
            if (innerAdjacent.states.facing === relativeDirections['left']) {
              const modifiedBlock = _.cloneDeep(target)
              modifiedBlock.states.shape = 'inner_left'
              modifier.setBlock(x, y, z, modifiedBlock)
              continue
            }
            if (innerAdjacent.states.facing === relativeDirections['right']) {
              const modifiedBlock = _.cloneDeep(target)
              modifiedBlock.states.shape = 'inner_right'
              modifier.setBlock(x, y, z, modifiedBlock)
              continue
            }
          }

          const modifiedBlock = _.cloneDeep(target)
          modifiedBlock.states.shape = 'straight'
          modifier.setBlock(x, y, z, modifiedBlock)
          continue
        }
      }
    }
  }

  const javaMcData = minecraftData(version)
  const adjustedPalette = modifier.palette.map((block) => {
    const stringizedStates = _.mapValues(block.states, _.toString)
    return getStateId(javaMcData, block.name, Object.entries(stringizedStates))
  })
  const adjustedBlocks = blocks

  return { adjustedPalette, adjustedBlocks }
}

export { McStructure, parseMcStructureBuffer, parseMcStructure }
