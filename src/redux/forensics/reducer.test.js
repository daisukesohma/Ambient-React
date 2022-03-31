import moment from 'moment'

import reducer, { initialState } from './reducer'
import * as types from './actionTypes'
import * as mockData from './mockData'

describe('Forensics Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle ENTITY_FETCH_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.ENTITY_FETCH_REQUESTED,
      }),
    ).toEqual({
      ...initialState,
      loadingSearch: true,
    })
  })

  it('should handle ENTITY_FETCH_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loadingSearch: true,
        },
        {
          type: types.ENTITY_FETCH_SUCCEEDED,
          payload: mockData.METADATA_BY_SITE,
        },
      ),
    ).toEqual({
      ...initialState,
      loadingSearch: false,
      searchResults: mockData.METADATA_BY_SITE.instances,
      searchResultsType: mockData.METADATA_BY_SITE.searchType,
      streamNodesWithHit: [1, 2],
      searchPages: mockData.METADATA_BY_SITE.pages,
      searchCurrentPage: mockData.METADATA_BY_SITE.currentPage,
      searchTotalCount: mockData.METADATA_BY_SITE.totalCount,
    })
  })

  it('should handle ENTITY_FETCH_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loadingSearch: true,
        },
        {
          type: types.ENTITY_FETCH_FAILED,
          payload: { error: 'ERROR' },
          error: true,
        },
      ),
    ).toEqual({
      ...initialState,
      loadingSearch: false,
      error: 'ERROR',
    })
  })

  it('should handle SET_RANGE_PRESET_INDEX', () => {
    expect(
      reducer(initialState, {
        type: types.SET_RANGE_PRESET_INDEX,
        payload: mockData.SEARCH_PRESET,
      }),
    ).toEqual({
      ...initialState,
      searchRangePresetIndex: mockData.SEARCH_PRESET,
    })
  })

  it('should handle RESET_SEARCH', () => {
    expect(
      reducer(initialState, {
        type: types.RESET_SEARCH,
      }),
    ).toEqual({
      ...initialState,
      shouldGenerateNewSearch: true,
    })
  })

  it('should handle TOGGLE_SHOULD_GENERATE_NEW_SEARCH', () => {
    expect(
      reducer(initialState, {
        type: types.TOGGLE_SHOULD_GENERATE_NEW_SEARCH,
      }),
    ).toEqual({
      ...initialState,
      shouldGenerateNewSearch: true,
    })
  })

  it('should handle SET_SEARCH_TS_RANGE', () => {
    expect(
      reducer(initialState, {
        type: types.SET_SEARCH_TS_RANGE,
        payload: 1592927760000,
      }),
    ).toEqual({
      ...initialState,
      searchTsRange: 1592927760000,
    })
  })

  it('should handle SET_SELECTION_TS_RANGE', () => {
    const endTs = moment().unix()
    const startTs = moment()
      .subtract(1, 'days')
      .unix()

    expect(
      reducer(initialState, {
        type: types.SET_SELECTION_TS_RANGE,
        payload: [startTs, endTs],
      }),
    ).toEqual({
      ...initialState,
      selectionTsRange: [startTs, endTs],
    })
  })

  it('should handle SET_SEARCH_QUERY', () => {
    expect(
      reducer(initialState, {
        type: types.SET_SEARCH_QUERY,
        payload: 'person',
      }),
    ).toEqual({
      ...initialState,
      searchQuery: 'person',
    })
  })

  it('should handle SET_SELECTED_PAGE', () => {
    expect(
      reducer(initialState, {
        type: types.SET_SELECTED_PAGE,
        payload: { selectedPage: 1 },
      }),
    ).toEqual({
      ...initialState,
      searchSelectedPage: 1,
    })
  })

  it('should handle REGIONS_FETCH_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.REGIONS_FETCH_REQUESTED,
      }),
    ).toEqual({
      ...initialState,
      loadingRegions: true,
    })
  })

  it('should handle REGIONS_FETCH_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loadingRegions: true,
        },
        {
          type: types.REGIONS_FETCH_SUCCEEDED,
          payload: { regions: mockData.REGIONS },
        },
      ),
    ).toEqual({
      ...initialState,
      loadingRegions: false,
      regions: mockData.REGIONS,
    })
  })

  it('should handle REGIONS_FETCH_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loadingRegions: true,
        },
        {
          type: types.REGIONS_FETCH_FAILED,
          payload: { error: 'ERROR' },
          error: true,
        },
      ),
    ).toEqual({
      ...initialState,
      loadingRegions: false,
      error: 'ERROR',
    })
  })

  it('should handle STREAMS_FETCH_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.STREAMS_FETCH_REQUESTED,
      }),
    ).toEqual({
      ...initialState,
      loadingStreams: true,
    })
  })

  it('should handle STREAMS_FETCH_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loadingStreams: true,
        },
        {
          type: types.STREAMS_FETCH_SUCCEEDED,
          payload: { streamsBySite: mockData.STREAMS },
        },
      ),
    ).toEqual({
      ...initialState,
      loadingStreams: false,
      streamsByRegion: {
        1: mockData.STREAMS.map(stream => ({ ...stream, active: true })),
      },
    })
  })

  it('should handle STREAMS_FETCH_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loadingStreams: true,
        },
        {
          type: types.STREAMS_FETCH_FAILED,
          payload: { error: 'ERROR' },
          error: true,
        },
      ),
    ).toEqual({
      ...initialState,
      loadingStreams: false,
    })
  })

  it('should handle SET_ACTIVE_STREAM', () => {
    expect(
      reducer(initialState, {
        type: types.SET_ACTIVE_STREAM,
        payload: {
          streamId: 1,
        },
      }),
    ).toEqual({
      ...initialState,
      activeStream: 1,
    })
  })

  it('should handle ACTIVATE_ALL_REGION_STREAMS', () => {
    expect(
      reducer(initialState, {
        type: types.ACTIVATE_ALL_REGION_STREAMS,
      }),
    ).toEqual({
      ...initialState,
      activeStream: null,
    })
  })

  it('should handle SET_HOVERED_REGION', () => {
    expect(
      reducer(initialState, {
        type: types.SET_HOVERED_REGION,
        payload: {
          regionId: 1,
        },
      }),
    ).toEqual({
      ...initialState,
      hoveredRegion: 1,
    })
  })

  it('should handle TOGGLE_ACTIVE_REGION', () => {
    expect(
      reducer(initialState, {
        type: types.TOGGLE_ACTIVE_REGION,
        payload: {
          regionId: 1,
        },
      }),
    ).toEqual({
      ...initialState,
      activeRegions: [1],
      activeStream: null,
    })
  })

  it('should handle SET_ACTIVE_REGIONS', () => {
    expect(
      reducer(initialState, {
        type: types.SET_ACTIVE_REGIONS,
        payload: [1],
      }),
    ).toEqual({
      ...initialState,
      activeRegions: [1],
      activeStream: null,
    })
  })
})
