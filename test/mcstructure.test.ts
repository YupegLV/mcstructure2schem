import fs from 'fs'
import path from 'path'
import { parseMcStructureBuffer } from '../src'
import { Vec3 } from 'vec3'

const blocksMcStructure = fs.readFileSync(
  path.join(__dirname, 'structures', 'blocks.mcstructure'),
)

test('standard blocks', async () => {
  const schematic = await parseMcStructureBuffer(blocksMcStructure)
  const expect_blocks = {
    '0,0,0': 'gold_block',
    '0,0,1': 'diamond_block',
    '0,1,0': 'glowstone',
    '0,1,1': 'copper_block',
    '1,0,0': 'emerald_block',
    '1,0,1': 'iron_block',
    '1,1,0': 'quartz_block',
    '1,1,1': 'lapis_block',
  }
  Object.entries(expect_blocks).forEach(([pos_key, block_name]) => {
    const pos = pos_key.split(',').map((value) => parseInt(value))
    expect(schematic.getBlock(new Vec3(pos[0], pos[1], pos[2])).name).toBe(
      block_name,
    )
  })
})
