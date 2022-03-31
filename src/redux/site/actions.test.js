import * as actions from './actions'
import * as types from './actionTypes'
import * as mockData from './mockData'

describe('Site actions', () => {
  it('fetchSitesByAccountRequested | should create an action to fetch all sites', () => {
    const accountSlug = 'account'
    const expectedAction = {
      type: types.FETCH_ALL_BY_ACCOUNT_REQUESTED,
      payload: { accountSlug },
    }
    expect(actions.fetchSitesByAccountRequested(accountSlug)).toEqual(
      expectedAction,
    )
  })

  it('fetchByAccountSucceeded | should create an action to save fetched sites', () => {
    const expectedAction = {
      type: types.FETCH_ALL_BY_ACCOUNT_SUCCEEDED,
      payload: { sites: mockData.SITES },
    }
    expect(actions.fetchByAccountSucceeded(mockData.SITES)).toEqual(
      expectedAction,
    )
  })

  it('fetchByAccountFailed | should create an action for failed fetch request', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.FETCH_ALL_BY_ACCOUNT_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.fetchByAccountFailed(payload)).toEqual(expectedAction)
  })
})
