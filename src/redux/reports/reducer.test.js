import reducer, { initialState } from './reducer'
import * as types from './actionTypes'
import { TEST_SITE } from './mockData'

describe('Activity Dashboard Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle CHANGE_DATE_FILTER', () => {
    const payload = {
      startTs: 1583395200,
      endTs: 1590476400,
    }
    expect(
      reducer(initialState, {
        type: types.CHANGE_DATE_FILTER,
        payload,
      }),
    ).toEqual({
      ...initialState,
      ...payload,
    })
  })

  it('should handle CHANGE_ALERT_EVENTS', () => {
    const payload = {
      key: 'dispatches',
      title: 'Dispatched Alerts',
      instances: [],
    }
    expect(
      reducer(initialState, {
        type: types.CHANGE_ALERT_EVENTS,
        payload,
      }),
    ).toEqual({
      ...initialState,
      alertEvents: {
        ...initialState.alertEvents,
        dispatches: payload,
      },
    })
  })

  it('should handle DISPLAY_ALERT_EVENTS', () => {
    const payload = 'acknowledgement'
    expect(
      reducer(initialState, {
        type: types.DISPLAY_ALERT_EVENTS,
        payload,
      }),
    ).toEqual({
      ...initialState,
      alertEventsSelectedKey: 'acknowledgement',
      alertEventsSelected: [],
      alertEventsSelectedTitle: '',
    })
  })

  it('should handle FETCH_SITES_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.FETCH_SITES_REQUESTED,
        payload: { accountSlug: 'acme' },
      }),
    ).toEqual({
      ...initialState,
      payload: { accountSlug: 'acme' },
      loading: true,
    })
  })

  it('should handle FETCH_SITES_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
        },
        {
          type: types.FETCH_SITES_SUCCEEDED,
          payload: [TEST_SITE],
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      sites: [TEST_SITE],
    })
  })

  it('should handle FETCH_SITES_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
        },
        {
          type: types.FETCH_SITES_FAILED,
          payload: { error: 'ERROR' },
          error: true,
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
    })
  })
})
