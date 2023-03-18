import nbt from 'prismarine-nbt'
import minecraftData from 'minecraft-data'
import blockMappings from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { Schematic } from 'prismarine-schematic'
import { Vec3 } from 'vec3'
import { getStateId } from 'prismarine-schematic/lib/states'

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
  let javaBlock = blockMappings.find((mapping) =>
    blockInfoEquals(mapping.pe, { name, states }),
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

type MappingBlockInfo = {
  name: string
  states: { [k: string]: string | number | boolean }
}

function blockInfoEquals(one: MappingBlockInfo, two: MappingBlockInfo) {
  return (
    one.name === two.name &&
    Object.entries(one.states).every(
      ([search_key, search_value]) => two.states[search_key] == search_value,
    )
  )
}

type XYZDirections = '+x' | '-x' | '+y' | '-y' | '+z' | '-z'
type CardinalDirections = 'east' | 'west' | 'south' | 'north'

function adjustStates(
  version: string,
  size: Vec3,
  paletteData: MappingBlockInfo[],
  blocks: number[],
) {
  function getBlock(x: number, y: number, z: number) {
    const indexId = blocks[x + z * size.x + y * size.x * size.z]
    return JSON.parse(JSON.stringify(paletteData[indexId]))
  }
  function setBlock(x: number, y: number, z: number, block: MappingBlockInfo) {
    let indexId = paletteData.findIndex((data) => blockInfoEquals(data, block))
    if (indexId === -1) {
      indexId = paletteData.push(block) - 1
    }
    blocks[x + z * size.x + y * size.x * size.z] = indexId
  }
  function getAdjacentBlocks(x: number, y: number, z: number) {
    const blocks: { [dir in XYZDirections]?: MappingBlockInfo } = {}
    if (0 <= x + 1 && x + 1 < size.x) blocks['+x'] = getBlock(x + 1, y, z)
    if (0 <= x - 1 && x - 1 < size.x) blocks['-x'] = getBlock(x - 1, y, z)
    if (0 <= y + 1 && y + 1 < size.y) blocks['+y'] = getBlock(x, y + 1, z)
    if (0 <= y - 1 && y - 1 < size.y) blocks['-y'] = getBlock(x, y - 1, z)
    if (0 <= z + 1 && z + 1 < size.z) blocks['+z'] = getBlock(x, y, z + 1)
    if (0 <= z - 1 && z - 1 < size.z) blocks['-z'] = getBlock(x, y, z - 1)
    return blocks
  }
  function filterAdjacentsInCardinalDirections(
    adjacents: ReturnType<typeof getAdjacentBlocks>,
    directions: CardinalDirections[],
  ) {
    const cardinal2xyzMapping: { [k in CardinalDirections]: XYZDirections } = {
      north: '-z',
      south: '+z',
      west: '-x',
      east: '+x',
    }
    return directions
      .map((dir) => cardinal2xyzMapping[dir])
      .reduce((result, dir) => {
        const adjacent = adjacents[dir]
        if (adjacent) result.push(adjacent)
        return result
      }, [] as MappingBlockInfo[])
  }
  function getRelativeDirections(facing: CardinalDirections): {
    front: CardinalDirections
    back: CardinalDirections
    left: CardinalDirections
    right: CardinalDirections
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
    facing: CardinalDirections
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
    block: MappingBlockInfo,
  ): block is { name: string; states: StairStates } {
    return block.name.includes('stairs')
  }

  for (let x = 0; x < size.x; x++) {
    for (let y = 0; y < size.y; y++) {
      for (let z = 0; z < size.z; z++) {
        const target = getBlock(x, y, z)

        if (isStair(target)) {
          const facing = target.states.facing
          const adjacents = getAdjacentBlocks(x, y, z)
          const relativeDirections = getRelativeDirections(facing)

          const straightAdjacents = filterAdjacentsInCardinalDirections(
            adjacents,
            [relativeDirections.left, relativeDirections.right],
          )
          if (
            straightAdjacents.some(
              (adjacent) =>
                isStair(adjacent) &&
                adjacent.states.half === target.states.half &&
                adjacent.states.facing === target.states.facing,
            )
          ) {
            target.states.shape = 'straight'
            setBlock(x, y, z, target)
            continue
          }

          const outerAdjacent = filterAdjacentsInCardinalDirections(adjacents, [
            relativeDirections['front'],
          ])[0]
          if (
            outerAdjacent &&
            isStair(outerAdjacent) &&
            outerAdjacent.states.half === target.states.half
          ) {
            if (outerAdjacent.states.facing === relativeDirections['left']) {
              target.states.shape = 'outer_left'
              setBlock(x, y, z, target)
              continue
            }
            if (outerAdjacent.states.facing === relativeDirections['right']) {
              target.states.shape = 'outer_right'
              setBlock(x, y, z, target)
              continue
            }
          }

          const innerAdjacent = filterAdjacentsInCardinalDirections(adjacents, [
            relativeDirections.back,
          ])[0]
          if (
            innerAdjacent &&
            isStair(innerAdjacent) &&
            innerAdjacent.states.half === target.states.half
          ) {
            if (innerAdjacent.states.facing === relativeDirections['left']) {
              target.states.shape = 'inner_left'
              setBlock(x, y, z, target)
              continue
            }
            if (innerAdjacent.states.facing === relativeDirections['right']) {
              target.states.shape = 'inner_right'
              setBlock(x, y, z, target)
              continue
            }
          }

          target.states.shape = 'straight'
          setBlock(x, y, z, target)
          continue
        }
      }
    }
  }

  const javaMcData = minecraftData(version)
  const adjustedPalette = paletteData.map((block) => {
    const stringizedStates = Object.entries(block.states).map<[string, string]>(
      ([key, value]) => [key, value.toString()],
    )

    return getStateId(javaMcData, block.name, stringizedStates)
  })
  const adjustedBlocks = blocks

  return { adjustedPalette, adjustedBlocks }
}

export { McStructure, parseMcStructureBuffer, parseMcStructure }
