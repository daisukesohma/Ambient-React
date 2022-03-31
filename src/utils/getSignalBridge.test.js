import getSignalBridge from './getSignalBridge'

describe('testing getSignalBridge utility function', () => {
  test('will return proper signalBridge url', () => {
    expect(getSignalBridge()).toBe('ws://test.ambient.ai:9004')
  })
})
