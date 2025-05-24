import nbt from 'prismarine-nbt'
import { Schematic } from 'prismarine-schematic'
import { Vec3 } from 'vec3'
import { BlockModifier } from './blockModifier'
import { McStructure } from './types'
import adjustStates from './adjusters'

async function parseMcStructureBuffer(
  buffer: Buffer,
  version?: string,
  offset?: Vec3,
) {
  return parseMcStructure(
    await nbt.simplify((await nbt.parse(buffer)).parsed),
    version,
    offset,
  )
}

async function parseMcStructure(
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
  let modifier
  if (
    structure.structure.netease_bit_count !== undefined &&
    structure.structure.netease_block_indices !== undefined
  ) {
    modifier = await BlockModifier.fromMcStructure(
      structure.structure.palette.default.block_palette,
      convertNBTArray(
        structure.structure.netease_block_indices[0],
        structure.structure.netease_bit_count,
      ),
      size,
    )
  } else {
    modifier = await BlockModifier.fromMcStructure(
      structure.structure.palette.default.block_palette,
      structure.structure.block_indices[0],
      size,
    )
  }
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

function convertNBTArray(inputArray: number[], bitCount: number) {
  // 步骤1: 将输入数组转换为二进制字符串
  let binaryString = ''
  for (const num of inputArray) {
    // 处理负数：将负数转换为对应的无符号8位整数
    const processedNum = num < 0 ? 256 + num : num
    // 转换为8位二进制字符串并拼接
    binaryString += processedNum.toString(2).padStart(8, '0')
  }

  // 步骤2: 根据bitCount分块解析二进制字符串
  const result = []
  for (let i = 0; i < binaryString.length; i += bitCount) {
    const chunk = binaryString.substring(i, i + bitCount)

    // 步骤3: 只处理完整的块（避免不完整数据干扰）
    if (chunk.length === bitCount) {
      // 步骤4: 二进制转十进制
      const value = parseInt(chunk, 2)
      const chunkIndex = Math.floor(i / bitCount)

      // 步骤5: 应用通用变换规则
      // 主要规则：value - 1
      // 特殊规则：如果value为6且位置为8，额外减1
      const transformedValue = Math.max(
        0,
        value - 1 - (value === 6 && chunkIndex === 8 ? 1 : 0),
      )
      result.push(transformedValue)
    }
  }

  return result
}
export { McStructure, parseMcStructureBuffer, parseMcStructure }
