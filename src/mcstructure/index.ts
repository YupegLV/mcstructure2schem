import nbt from 'prismarine-nbt'
import { Schematic } from 'prismarine-schematic'
import { Vec3 } from 'vec3'
import { BlockModifier } from './blockModifier'
import _ from 'lodash'
import { McStructure } from './types'
import adjustStates from './adjusters'

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

  const modifier = BlockModifier.fromMcStructure(
    structure.structure.palette.default.block_palette,
    structure.structure.block_indices[0],
    size,
  )
  adjustStates(modifier)

  return new Schematic(
    version,
    size,
    offset,
    modifier.generateStateIdPalette(version),
    modifier.indices,
  )
}

function verNum2majorVer(version: number) {
  const versionArray: number[] = []
  for (let i = 0; i < 4; i++) {
    const shiftedVersion = version >> (8 * i)
    versionArray[i] = shiftedVersion & 0xff
  }
  return versionArray.reverse().slice(0, 2).join('.')
}

export { McStructure, parseMcStructureBuffer, parseMcStructure }
