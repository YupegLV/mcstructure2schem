import { Adjuster } from '.'
import glassPaneAdjuster from './glassPane'

test('default', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'glass_pane',
    states: {},
  }

  const result = glassPaneAdjuster(target, {})
  expect(result?.states).toEqual({
    north: false,
    south: false,
    west: false,
    east: false,
  })
})

test('adjacent', () => {
  const target: Parameters<Adjuster>[0] = {
    name: 'glass_pane',
    states: {},
  }
  const adjacents: Parameters<Adjuster>[1] = {
    north: {
      name: 'glass_pane',
      states: {},
    },
    south: {
      name: 'glass_pane',
      states: {},
    },
    west: {
      name: 'glass_pane',
      states: {},
    },
    east: {
      name: 'air',
      states: {},
    },
  }

  const result = glassPaneAdjuster(target, adjacents)
  expect(result?.states).toEqual({
    north: true,
    south: true,
    west: true,
    east: false,
  })
})
