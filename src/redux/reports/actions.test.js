import * as actions from './actions'
import * as types from './actionTypes'
import { TEST_SITE } from './mockData'

describe('activity dashboard actions', () => {
  it('changeDateFilter | should create an action to change date filter', () => {
    const payload = {
      startTs: 1583395200,
      endTs: 1590476400,
    }
    const expectedAction = {
      type: types.CHANGE_DATE_FILTER,
      payload,
    }
    expect(actions.changeDateFilter(payload)).toEqual(expectedAction)
  })

  it('changeAlertEvents | should create an action to change alert events', () => {
    const payload = {
      key: 'dispatches',
      title: 'Dispatched Alerts',
      instances: [],
    }
    const expectedAction = {
      type: types.CHANGE_ALERT_EVENTS,
      payload,
    }
    expect(actions.changeAlertEvents(payload)).toEqual(expectedAction)
  })

  it('displayAlertEvents | should create an action to display alert events', () => {
    const payload = 'acknowledgement'
    const expectedAction = {
      type: types.DISPLAY_ALERT_EVENTS,
      payload,
    }
    expect(actions.displayAlertEvents(payload)).toEqual(expectedAction)
  })

  it('fetchSitesRequested | should create an action to fetch sites', () => {
    const payload = {
      accountSlug: 'acme',
    }
    const expectedAction = {
      type: types.FETCH_SITES_REQUESTED,
      payload,
    }
    expect(actions.fetchSitesRequested(payload)).toEqual(expectedAction)
  })

  it('fetchSitesSucceeded | should create an action to handle successful sites fetch', () => {
    const payload = [TEST_SITE]
    const expectedAction = {
      type: types.FETCH_SITES_SUCCEEDED,
      payload,
    }
    expect(actions.fetchSitesSucceeded(payload)).toEqual(expectedAction)
  })

  it('fetchSitesFailed | should create an action to handle failed sites fetch', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.FETCH_SITES_FAILED,
      payload,
      error: true,
    }
    expect(actions.fetchSitesFailed(payload)).toEqual(expectedAction)
  })
})
