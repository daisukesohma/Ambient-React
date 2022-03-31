import * as actions from './index'
import * as mockData from './mockData'

describe('Node actions', () => {
  it('fetchNodesByAccountRequested | should create an action to fetch all nodes', () => {
    const payload = { accountSlug: 'account' }
    const expectedAction = {
      type: actions.fetchNodesByAccountRequested.type,
      payload,
    }
    expect(actions.fetchNodesByAccountRequested(payload)).toEqual(
      expectedAction,
    )
  })

  it('fetchNodesByAccountSucceeded | should create an action to save fetched nodes', () => {
    const payload = { sites: mockData.NODES }
    const expectedAction = {
      type: actions.fetchNodesByAccountSucceeded.type,
      payload,
    }
    expect(actions.fetchNodesByAccountSucceeded(payload)).toEqual(
      expectedAction,
    )
  })

  it('fetchNodesByAccountFailed | should create an action for failed fetch request', () => {
    const payload = { message: 'ERROR' }
    const expectedAction = {
      type: actions.fetchNodesByAccountFailed.type,
      payload,
    }
    expect(actions.fetchNodesByAccountFailed(payload)).toEqual(expectedAction)
  })
})
