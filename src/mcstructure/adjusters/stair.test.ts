import stairAdjuster from './stair'
import { Adjuster } from '.'

test('default', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'stairs',
    states: { facing: 'north', half: 'bottom' },
  }

  const result = stairAdjuster(target, {})
  expect(result?.states.shape).toBe('straight')
})

describe('outer', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'stairs',
    states: { facing: 'north', half: 'bottom' },
  }
  test('left', () => {
    const adjacents: Parameters<Adjuster>[1] = {
      north: {
        name: 'stairs',
        states: { facing: 'west', half: 'bottom' },
      },
    }

    const result = stairAdjuster(target, adjacents)
    expect(result?.states.shape).toBe('outer_left')
  })
  test('right', () => {
    const adjacents: Parameters<Adjuster>[1] = {
      north: {
        name: 'stairs',
        states: { facing: 'east', half: 'bottom' },
      },
    }

    const result = stairAdjuster(target, adjacents)
    expect(result?.states.shape).toBe('outer_right')
  })
})

describe('inner', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'stairs',
    states: { facing: 'north', half: 'bottom' },
  }
  test('left', () => {
    const adjacents: Parameters<Adjuster>[1] = {
      south: {
        name: 'stairs',
        states: { facing: 'west', half: 'bottom' },
      },
    }

    const result = stairAdjuster(target, adjacents)
    expect(result?.states.shape).toBe('inner_left')
  })
  test('right', () => {
    const adjacents: Parameters<Adjuster>[1] = {
      south: {
        name: 'stairs',
        states: { facing: 'east', half: 'bottom' },
      },
    }

    const result = stairAdjuster(target, adjacents)
    expect(result?.states.shape).toBe('inner_right')
  })
})

test('Outer takes priority than Inner.', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'stairs',
    states: { facing: 'north', half: 'bottom' },
  }
  const adjacents: Parameters<Adjuster>[1] = {
    north: {
      name: 'stairs',
      states: { facing: 'east', half: 'bottom' },
    },
    south: {
      name: 'stairs',
      states: { facing: 'west', half: 'bottom' },
    },
  }

  const result = stairAdjuster(target, adjacents)
  expect(result?.states.shape).toBe('outer_right')
})

test('Do not transform a straight line', async () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'stairs',
    states: { facing: 'north', half: 'bottom' },
  }
  const adjacents: Parameters<Adjuster>[1] = {
    west: {
      name: 'stairs',
      states: { facing: 'north', half: 'bottom' },
    },
    east: {
      name: 'stairs',
      states: { facing: 'north', half: 'bottom' },
    },
    south: {
      name: 'stairs',
      states: { facing: 'west', half: 'bottom' },
    },
  }

  const result = stairAdjuster(target, adjacents)
  expect(result?.states.shape).toBe('straight')
})

test('Transform the end of a straight line', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'stairs',
    states: { facing: 'north', half: 'bottom' },
  }
  const adjacents: Parameters<Adjuster>[1] = {
    east: {
      name: 'stairs',
      states: { facing: 'north', half: 'bottom' },
    },
    south: {
      name: 'stairs',
      states: { facing: 'west', half: 'bottom' },
    },
  }

  const result = stairAdjuster(target, adjacents)
  expect(result?.states.shape).toBe('inner_left')
})
