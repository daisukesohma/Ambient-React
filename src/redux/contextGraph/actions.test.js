import { toggleEdges } from './actions'
import { TOGGLE_EDGES } from './actionTypes'

describe('actions', () => {
  it('should create an action to show edges on Context Graph', () => {
    const expectedAction = {
      type: TOGGLE_EDGES,
    }
    expect(toggleEdges()).toEqual(expectedAction)
  })
})
