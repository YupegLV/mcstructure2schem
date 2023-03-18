import fs from 'fs'
import path from 'path'
import { parseMcStructureBuffer } from '../src'
import { Schematic } from 'prismarine-schematic'
import { Vec3 } from 'vec3'

describe('default shape', () => {
  let schematic: Schematic
  beforeAll(async () => {
    const file = fs.readFileSync(
      path.join(__dirname, 'stairs', 'one.mcstructure'),
    )
    schematic = await parseMcStructureBuffer(file)
  })

  const shapes: [Vec3, string][] = [[new Vec3(0, 0, 0), 'straight']]
  it.each(shapes)('%p %p', (pos, shape) => {
    expect(schematic.getBlock(pos).getProperties()['shape']).toBe(shape)
  })
})

describe('straight stairs', () => {
  let schematic: Schematic
  beforeAll(async () => {
    const file = fs.readFileSync(
      path.join(__dirname, 'stairs', 'straight.mcstructure'),
    )
    schematic = await parseMcStructureBuffer(file)
  })

  const shapes: [Vec3, string][] = [
    [new Vec3(0, 0, 0), 'straight'],
    [new Vec3(0, 0, 1), 'straight'],
    [new Vec3(1, 0, 0), 'straight'],
    [new Vec3(1, 0, 1), 'straight'],
  ]
  it.each(shapes)('%p %p', (pos, shape) => {
    expect(schematic.getBlock(pos).getProperties()['shape']).toBe(shape)
  })
})

describe('outer stairs', () => {
  let schematic: Schematic
  beforeAll(async () => {
    const file = fs.readFileSync(
      path.join(__dirname, 'stairs', 'outer.mcstructure'),
    )
    schematic = await parseMcStructureBuffer(file)
  })

  const shapes: [Vec3, string][] = [
    [new Vec3(0, 0, 0), 'outer_right'],
    [new Vec3(0, 0, 1), 'outer_right'],
    [new Vec3(1, 0, 0), 'outer_right'],
    [new Vec3(1, 0, 1), 'outer_right'],
  ]
  it.each(shapes)('%p %p', (pos, shape) => {
    expect(schematic.getBlock(pos).getProperties()['shape']).toBe(shape)
  })
})

describe('inner stairs', () => {
  let schematic: Schematic
  beforeAll(async () => {
    const file = fs.readFileSync(
      path.join(__dirname, 'stairs', 'inner.mcstructure'),
    )
    schematic = await parseMcStructureBuffer(file)
  })

  const shapes: [Vec3, string][] = [
    [new Vec3(0, 0, 0), 'inner_left'],
    [new Vec3(0, 0, 1), 'inner_left'],
    [new Vec3(1, 0, 0), 'inner_left'],
    [new Vec3(1, 0, 1), 'inner_left'],
  ]
  it.each(shapes)('%p %p', (pos, shape) => {
    expect(schematic.getBlock(pos).getProperties()['shape']).toBe(shape)
  })
})

describe('Straight takes priority than any other shape.', () => {
  let schematic: Schematic
  beforeAll(async () => {
    const file = fs.readFileSync(
      path.join(__dirname, 'stairs', 'straight_than_any.mcstructure'),
    )
    schematic = await parseMcStructureBuffer(file)
  })

  const shapes: [Vec3, string][] = [
    [new Vec3(0, 0, 0), 'straight'],
    [new Vec3(0, 0, 1), 'straight'],
    [new Vec3(0, 0, 2), 'straight'],
    [new Vec3(1, 0, 1), 'straight'],
  ]
  it.each(shapes)('%p %p', (pos, shape) => {
    expect(schematic.getBlock(pos).getProperties()['shape']).toBe(shape)
  })
})

describe('Outer takes priority than Inner.', () => {
  let schematic: Schematic
  beforeAll(async () => {
    const file = fs.readFileSync(
      path.join(__dirname, 'stairs', 'outer_than_inner.mcstructure'),
    )
    schematic = await parseMcStructureBuffer(file)
  })

  const shapes: [Vec3, string][] = [
    [new Vec3(0, 0, 0), 'straight'],
    [new Vec3(0, 0, 1), 'outer_right'],
    [new Vec3(0, 0, 2), 'straight'],
  ]
  it.each(shapes)('%p %p', (pos, shape) => {
    expect(schematic.getBlock(pos).getProperties()['shape']).toBe(shape)
  })
})
