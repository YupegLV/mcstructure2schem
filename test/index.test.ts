import hello from '../src/index'

test('Hello user!', () => {
  expect(hello('nova27')).toBe('Hello nova27')
})
