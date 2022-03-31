import reducer, { initialState } from './reducer'
import * as types from './actionTypes'
import {
  TEST_NODE,
  TEST_STREAM_DISCOVERY,
  TEST_IP,
  TEST_STREAM,
  TEST_STREAM_REQUEST,
} from './mockData'

describe('Stream Discovery Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle FETCH_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.FETCH_REQUESTED,
        payload: { nodeRequestId: 'test_id' },
      }),
    ).toEqual({
      ...initialState,
      loading: true,
    })
  })

  it('should handle FETCH_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
        },
        {
          type: types.FETCH_SUCCEEDED,
          payload: TEST_STREAM_DISCOVERY,
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      nodeRequest: TEST_STREAM_DISCOVERY,
      nodes: [TEST_NODE],
    })
  })

  it('should handle FETCH_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
        },
        {
          type: types.FETCH_FAILED,
          payload: { error: 'ERROR' },
          error: true,
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      error: 'ERROR',
    })
  })

  it('should handle SELECTED_NODE_CHANGED', () => {
    expect(
      reducer(initialState, {
        type: types.SELECTED_NODE_CHANGED,
        payload: TEST_NODE,
      }),
    ).toEqual({
      ...initialState,
      selectedNode: TEST_NODE,
    })
  })

  it('should handle EXPAND_IP', () => {
    expect(
      reducer(initialState, {
        type: types.EXPAND_IP,
        payload: TEST_IP,
      }),
    ).toEqual({
      ...initialState,
      expandedIp: TEST_IP,
    })
  })

  it('should handle COLLAPSE_IP', () => {
    expect(
      reducer(initialState, {
        type: types.COLLAPSE_IP,
      }),
    ).toEqual({
      ...initialState,
      expandedIp: null,
    })
  })

  it('should handle ADD_STREAM', () => {
    expect(
      reducer(initialState, {
        type: types.ADD_STREAM,
        payload: TEST_STREAM,
      }),
    ).toEqual({
      ...initialState,
      streamsToCreate: [TEST_STREAM],
    })
  })

  it('should handle REMOVE_STREAM', () => {
    expect(
      reducer(
        {
          ...initialState,
          streamsToCreate: [TEST_STREAM],
        },
        {
          type: types.REMOVE_STREAM,
          payload: TEST_STREAM.id,
        },
      ),
    ).toEqual({
      ...initialState,
      streamsToCreate: [],
    })
  })

  it('should handle CREATE_STREAMS_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.CREATE_STREAMS_REQUESTED,
        payload: { data: [TEST_STREAM_REQUEST] },
      }),
    ).toEqual({
      ...initialState,
      loading: true,
      isSubmitting: true,
    })
  })

  it('should handle CREATE_STREAMS_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          isSubmitting: true,
        },
        {
          type: types.CREATE_STREAMS_SUCCEEDED,
          payload: {
            ok: true,
            message: 'Streams created',
            streamIds: [3867],
          },
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      isSubmitting: false,
    })
  })

  it('should handle CREATE_STREAMS_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
          isSubmitting: true,
        },
        {
          type: types.CREATE_STREAMS_FAILED,
          payload: {
            error: 'ERROR',
          },
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      isSubmitting: false,
      error: 'ERROR',
    })
  })

  it('should handle TOGGLE_CONFIRM_MODAL', () => {
    expect(
      reducer(initialState, {
        type: types.TOGGLE_CONFIRM_MODAL,
      }),
    ).toEqual({
      ...initialState,
      showModal: true,
    })
  })

  it('should handle CHANGE_STREAM_NAME', () => {
    expect(
      reducer(
        {
          ...initialState,
          streamsToCreate: [{ id: 3867, streamName: 'test' }],
        },
        {
          type: types.CHANGE_STREAM_NAME,
          payload: {
            id: 3867,
            streamName: 'renamed',
          },
        },
      ),
    ).toEqual({
      ...initialState,
      streamsToCreate: [{ id: 3867, streamName: 'renamed' }],
    })
  })

  it('should handle CHANGE_STREAM_REGION', () => {
    expect(
      reducer(
        {
          ...initialState,
          streamsToCreate: [{ id: 3867, streamName: 'test', regionId: 12 }],
        },
        {
          type: types.CHANGE_STREAM_REGION,
          payload: {
            id: 3867,
            streamName: 'test',
            value: 31,
          },
        },
      ),
    ).toEqual({
      ...initialState,
      streamsToCreate: [{ id: 3867, streamName: 'test', regionId: 31 }],
    })
  })

  it('should handle SET_IS_CREATOR_DIRTY', () => {
    expect(
      reducer(initialState, {
        type: types.SET_IS_CREATOR_DIRTY,
        payload: true,
      }),
    ).toEqual({
      ...initialState,
      isCreatorDirty: true,
    })
  })

  it('should handle SET_IS_SELECTOR_DIRTY', () => {
    expect(
      reducer(initialState, {
        type: types.SET_IS_SELECTOR_DIRTY,
        payload: true,
      }),
    ).toEqual({
      ...initialState,
      isSelectorDirty: true,
    })
  })

  it('should handle SAVE_CREATOR_DATA', () => {
    expect(
      reducer(
        { ...initialState, saved: {} },
        {
          type: types.SAVE_CREATOR_DATA,
          payload: [
            {
              name: 'test',
            },
          ],
        },
      ),
    ).toEqual({
      ...initialState,
      saved: {
        creator: {
          data: [
            {
              name: 'test',
            },
          ],
        },
      },
    })
  })

  it('should handle SAVE_CREATOR_SELECTED_ROW_IDS', () => {
    expect(
      reducer(
        { ...initialState, saved: {} },
        {
          type: types.SAVE_CREATOR_SELECTED_ROW_IDS,
          payload: [1, 2, 3],
        },
      ),
    ).toEqual({
      ...initialState,
      saved: {
        creator: {
          selectedRowIds: [1, 2, 3],
        },
      },
    })
  })

  it('should handle FETCH_THUMBNAIL_REQUESTED', () => {
    expect(
      reducer(initialState, {
        type: types.FETCH_THUMBNAIL_REQUESTED,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
    })
  })

  it('should handle FETCH_THUMBNAIL_SUCCEEDED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
        },
        {
          type: types.FETCH_THUMBNAIL_SUCCEEDED,
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
    })
  })

  it('should handle FETCH_THUMBNAIL_FAILED', () => {
    expect(
      reducer(
        {
          ...initialState,
          loading: true,
        },
        {
          type: types.FETCH_THUMBNAIL_FAILED,
          payload: { error: 'ERROR' },
          error: true,
        },
      ),
    ).toEqual({
      ...initialState,
      loading: false,
      error: { error: 'ERROR' },
    })
  })

  it('should handle CLEAR_STREAM_DISCOVERY', () => {
    expect(
      reducer(
        { ...initialState, streamsToCreate: [TEST_STREAM] },
        {
          type: types.CLEAR_STREAM_DISCOVERY,
        },
      ),
    ).toEqual(initialState)
  })
})
