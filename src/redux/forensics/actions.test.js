import * as actions from './actions'
import * as types from './actionTypes'
import * as mockData from './mockData'

describe('Forensics actions', () => {
  it('entityFetchRequested | should create an action to fetch entities', () => {
    const expectedAction = {
      type: types.ENTITY_FETCH_REQUESTED,
    }
    expect(actions.entityFetchRequested()).toEqual(expectedAction)
  })

  it('entityFetchSucceeded | should create an action to save fetched entities', () => {
    const expectedAction = {
      type: types.ENTITY_FETCH_SUCCEEDED,
      payload: mockData.METADATA_BY_SITE,
    }
    expect(actions.entityFetchSucceeded(mockData.METADATA_BY_SITE)).toEqual(
      expectedAction,
    )
  })

  it('entityFetchFailed | should create an action for failed fetch request', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.ENTITY_FETCH_FAILED,
      payload,
      error: true,
    }
    expect(actions.entityFetchFailed(payload)).toEqual(expectedAction)
  })

  it('setRangePresetIndex | should create an action to set range preset index', () => {
    const expectedAction = {
      type: types.SET_RANGE_PRESET_INDEX,
      payload: mockData.SEARCH_PRESET,
    }
    expect(actions.setRangePresetIndex(mockData.SEARCH_PRESET)).toEqual(
      expectedAction,
    )
  })

  it('resetSearch | should create an action to reset search', () => {
    const expectedAction = {
      type: types.RESET_SEARCH,
    }
    expect(actions.resetSearch()).toEqual(expectedAction)
  })

  it('toggleShouldGenerateNewSearch | should create an action to toggle generate new search flag', () => {
    const expectedAction = {
      type: types.TOGGLE_SHOULD_GENERATE_NEW_SEARCH,
    }
    expect(actions.toggleShouldGenerateNewSearch()).toEqual(expectedAction)
  })

  it('setSearchQuery | should create an action to set search query', () => {
    const query = 'query'
    const expectedAction = {
      type: types.SET_SEARCH_QUERY,
      payload: query,
    }
    expect(actions.setSearchQuery(query)).toEqual(expectedAction)
  })

  it('setSearchTsRange | should create an action to set search TS range', () => {
    const range = [1592927760000, 1592927760001]
    const expectedAction = {
      type: types.SET_SEARCH_TS_RANGE,
      payload: range,
    }
    expect(actions.setSearchTsRange(range)).toEqual(expectedAction)
  })

  it('setSelectedPage | should create an action to set selected page', () => {
    const payload = { selectedPage: 1 }
    const expectedAction = {
      type: types.SET_SELECTED_PAGE,
      payload,
    }
    expect(actions.setSelectedPage(payload.selectedPage)).toEqual(
      expectedAction,
    )
  })

  it('setSelectionTsRange | should create an action to set the outer selection overall range that we are searching on', () => {
    const range = [1592927760000, 1592927760001]
    const expectedAction = {
      type: types.SET_SELECTION_TS_RANGE,
      payload: range,
    }
    expect(actions.setSelectionTsRange(range)).toEqual(expectedAction)
  })

  it('regionsFetchRequested | should create an action to fetch regions', () => {
    const expectedAction = {
      type: types.REGIONS_FETCH_REQUESTED,
    }
    expect(actions.regionsFetchRequested()).toEqual(expectedAction)
  })

  it('regionsFetchSucceeded | should create an action to save fetched regions', () => {
    const payload = {
      regions: mockData.REGIONS,
    }
    const expectedAction = {
      type: types.REGIONS_FETCH_SUCCEEDED,
      payload,
    }
    expect(actions.regionsFetchSucceeded(payload.regions)).toEqual(
      expectedAction,
    )
  })

  it('regionsFetchFailed | should create an action for failed fetch region request', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.REGIONS_FETCH_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.regionsFetchFailed(payload)).toEqual(expectedAction)
  })

  it('regionsSetHovered | should create an action to set regions hovered state', () => {
    const payload = { regionId: 1 }
    const expectedAction = {
      type: types.SET_HOVERED_REGION,
      payload,
    }
    expect(actions.regionsSetHovered(payload.regionId)).toEqual(expectedAction)
  })

  it('regionsToggleActive | should create an action to set regions toggle active state', () => {
    const payload = { regionId: 1 }
    const expectedAction = {
      type: types.TOGGLE_ACTIVE_REGION,
      payload,
    }
    expect(actions.regionsToggleActive(payload.regionId)).toEqual(
      expectedAction,
    )
  })

  it('setActiveRegions | should create an action to set active regions', () => {
    const regions = [1, 2]
    const expectedAction = {
      type: types.SET_ACTIVE_REGIONS,
      payload: regions,
    }
    expect(actions.setActiveRegions(regions)).toEqual(expectedAction)
  })

  it('regionStatsFetchRequested | should create an action to fetch region stats', () => {
    const expectedAction = {
      type: types.REGION_STATS_FETCH_REQUESTED,
    }
    expect(actions.regionStatsFetchRequested()).toEqual(expectedAction)
  })

  it('regionStatsFetchSucceeded | should create an action to save fetched region stats', () => {
    const payload = {
      regionStats: mockData.REGION_STATS,
    }
    const expectedAction = {
      type: types.REGION_STATS_FETCH_SUCCEEDED,
      payload,
    }
    expect(actions.regionStatsFetchSucceeded(payload)).toEqual(expectedAction)
  })

  it('regionStatsFetchFailed | should create an action for failed fetch region stats request', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.REGION_STATS_FETCH_FAILED,
      payload,
      error: true,
    }
    expect(actions.regionStatsFetchFailed(payload)).toEqual(expectedAction)
  })

  it('streamsBySiteFetchRequested | should create an action to fetch streams by site', () => {
    const payload = { accountSlug: 'account', siteSlug: 'site' }
    const expectedAction = {
      type: types.STREAMS_FETCH_REQUESTED,
      payload,
    }
    expect(actions.streamsBySiteFetchRequested(payload)).toEqual(expectedAction)
  })

  it('streamsBySiteFetchSucceeded | should create an action to save fetched stream by site', () => {
    const payload = {
      streamsBySite: mockData.STREAMS,
    }
    const expectedAction = {
      type: types.STREAMS_FETCH_SUCCEEDED,
      payload,
    }
    expect(actions.streamsBySiteFetchSucceeded(payload.streamsBySite)).toEqual(
      expectedAction,
    )
  })

  it('streamsBySiteFetchFailed | should create an action for failed fetch streams by site request', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.STREAMS_FETCH_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.streamsBySiteFetchFailed(payload)).toEqual(expectedAction)
  })

  it('snapshotsFetchRequested | should create an action to fetch snapshots', () => {
    const payload = { streamId: 1, startTs: 1592927760000 }
    const expectedAction = {
      type: types.SNAPSHOTS_FETCH_REQUESTED,
      payload,
    }
    expect(actions.snapshotsFetchRequested(payload)).toEqual(expectedAction)
  })

  it('snapshotsFetchSucceeded | should create an action to save fetched snapshots', () => {
    const payload = {
      snapshots: mockData.STREAMS,
    }
    const expectedAction = {
      type: types.SNAPSHOTS_FETCH_SUCCEEDED,
      payload,
    }
    expect(actions.snapshotsFetchSucceeded(payload.snapshots)).toEqual(
      expectedAction,
    )
  })

  it('snapshotsFetchFailed | should create an action for failed fetch snapshots', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.SNAPSHOTS_FETCH_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.snapshotsFetchFailed(payload)).toEqual(expectedAction)
  })
})
