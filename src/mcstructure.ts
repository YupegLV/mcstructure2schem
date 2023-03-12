import nbt from 'prismarine-nbt'
import minecraftData from 'minecraft-data'
import blockMappings from 'minecraft-data/minecraft-data/data/bedrock/1.19.1/blockMappings.json'
import { Schematic } from 'prismarine-schematic'
import { Vec3 } from 'vec3'
import { getStateId } from 'prismarine-schematic/lib/states'

type BlockPalette = {
  name: string
  states: { [k: string]: string | number }
  version: number
}[]

type McStructure = {
  size: [number, number, number]
  structure: {
    block_indices: [number[], number[]]
    palette: {
      default: {
        block_palette: BlockPalette
      }
    }
  }
}

async function parseMcStructure(
  data: Buffer | McStructure,
  offset: Vec3 = new Vec3(0, 0, 0),
) {
  const parsedNbt: McStructure =
    data instanceof Buffer ? nbt.simplify((await nbt.parse(data)).parsed) : data

  const majorVersion = verNum2majorVer(
    parsedNbt.structure.palette.default.block_palette[0].version,
  )
  const size = new Vec3(parsedNbt.size[0], parsedNbt.size[1], parsedNbt.size[2])
  const palette = parseBlockPalette(
    majorVersion,
    parsedNbt.structure.palette.default.block_palette,
  )
  const blocks = zyx2xzy(parsedNbt.structure.block_indices[0], size)

  return new Schematic(majorVersion, size, offset, palette, blocks)
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

function parseBlockPalette(version: string, palette: BlockPalette) {
  const javaMcData = minecraftData(version)
  const javaPalette = palette.map((block) => {
    const javaBlock = bedrock2java(
      block.name.replace('minecraft:', ''),
      block.states,
    )
    const stringizedStates = Object.entries(javaBlock.states).map<
      [string, string]
    >(([key, value]) => [key, value.toString()])

    return getStateId(javaMcData, javaBlock.name, stringizedStates)
  })
  return javaPalette
}

function bedrock2java(name: string, states: { [k: string]: string | number }) {
  let javaBlock = blockMappings.find(
    (mapping) =>
      mapping.pe.name === name &&
      Object.entries(mapping.pe.states).every(
        ([search_key, search_value]) => states[search_key] === search_value,
      ),
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

export { McStructure, parseMcStructure }
