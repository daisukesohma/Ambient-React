import * as actions from './actions'
import * as types from './actionTypes'
import {
  TEST_NODE,
  TEST_STREAM_DISCOVERY,
  TEST_STREAM,
  TEST_IP,
  TEST_STREAM_REQUEST,
} from './mockData'

describe('stream discovery actions', () => {
  it('streamDiscoveryFetchRequested | should create an action to fetch stream discovery', () => {
    const payload = { nodeRequestId: 'test_id' }
    const expectedAction = {
      type: types.FETCH_REQUESTED,
      payload,
    }
    expect(actions.streamDiscoveryFetchRequested(payload)).toEqual(
      expectedAction,
    )
  })

  it('streamDiscoveryFetchSucceeded | should create an action to store fetched result', () => {
    const payload = { data: TEST_STREAM_DISCOVERY }
    const expectedAction = {
      type: types.FETCH_SUCCEEDED,
      payload: payload.data,
    }
    expect(actions.streamDiscoveryFetchSucceeded(payload)).toEqual(
      expectedAction,
    )
  })

  it('streamDiscoveryFetchFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.FETCH_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.streamDiscoveryFetchFailed(payload)).toEqual(expectedAction)
  })

  it('selectedNodeChanged | should create an action to select a node', () => {
    const payload = { data: TEST_NODE }
    const expectedAction = {
      type: types.SELECTED_NODE_CHANGED,
      payload: TEST_NODE,
    }
    expect(actions.selectedNodeChanged(payload)).toEqual(expectedAction)
  })

  it('addStream | should create an action to add a stream', () => {
    const payload = TEST_STREAM.id
    const expectedAction = {
      type: types.ADD_STREAM,
      payload,
    }
    expect(actions.addStream(payload)).toEqual(expectedAction)
  })

  it('removeStream | should create an action to remove a stream', () => {
    const payload = TEST_STREAM
    const expectedAction = {
      type: types.REMOVE_STREAM,
      payload,
    }
    expect(actions.removeStream(payload)).toEqual(expectedAction)
  })

  it('expandIp | should create an action to expand an IP', () => {
    const payload = TEST_IP
    const expectedAction = {
      type: types.EXPAND_IP,
      payload,
    }
    expect(actions.expandIp(payload)).toEqual(expectedAction)
  })

  it('collapseIp | should create an action to collapse an IP', () => {
    const expectedAction = {
      type: types.COLLAPSE_IP,
    }
    expect(actions.collapseIp()).toEqual(expectedAction)
  })

  it('createStreamsRequested | should create an action to create a stream', () => {
    const payload = { data: [TEST_STREAM_REQUEST] }
    const expectedAction = {
      type: types.CREATE_STREAMS_REQUESTED,
      payload,
    }
    expect(actions.createStreamsRequested(payload)).toEqual(expectedAction)
  })

  it('createStreamsSucceeded | should create an action to handle stream creation response', () => {
    const payload = {
      ok: true,
      message: 'Streams created',
      streamIds: [3867],
    }
    const expectedAction = {
      type: types.CREATE_STREAMS_SUCCEEDED,
      payload,
    }
    expect(actions.createStreamsSucceeded(payload)).toEqual(expectedAction)
  })

  it('createStreamsFailed | should create an action to handle stream creation failing', () => {
    const payload = {
      error: 'ERROR',
    }
    const expectedAction = {
      type: types.CREATE_STREAMS_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.createStreamsFailed(payload)).toEqual(expectedAction)
  })

  it('toggleConfirmModal | should create an action to handle toggle confirm modal', () => {
    const expectedAction = {
      type: types.TOGGLE_CONFIRM_MODAL,
    }
    expect(actions.toggleConfirmModal()).toEqual(expectedAction)
  })

  it('changeStreamName | should create an action to change stream name', () => {
    const payload = {
      id: 3867,
      streamName: 'test',
    }
    const expectedAction = {
      type: types.CHANGE_STREAM_NAME,
      payload,
    }
    expect(actions.changeStreamName(payload)).toEqual(expectedAction)
  })

  it('changeStreamRegion | should create an action to change stream region', () => {
    const payload = {
      id: 3867,
      streamName: 'test',
      value: 31,
    }
    const expectedAction = {
      type: types.CHANGE_STREAM_REGION,
      payload,
    }
    expect(actions.changeStreamRegion(payload)).toEqual(expectedAction)
  })

  it('setIsCreatorDirty | should create an action to set creator as dirty', () => {
    const payload = false
    const expectedAction = {
      type: types.SET_IS_CREATOR_DIRTY,
      payload,
    }
    expect(actions.setIsCreatorDirty(payload)).toEqual(expectedAction)
  })

  it('setIsSelectorDirty | should create an action to set selector as dirty', () => {
    const payload = false
    const expectedAction = {
      type: types.SET_IS_SELECTOR_DIRTY,
      payload,
    }
    expect(actions.setIsSelectorDirty(payload)).toEqual(expectedAction)
  })

  it('saveCreatorData | should create an action to save creator data', () => {
    const payload = [
      {
        name: 'test',
      },
    ]
    const expectedAction = {
      type: types.SAVE_CREATOR_DATA,
      payload,
    }
    expect(actions.saveCreatorData(payload)).toEqual(expectedAction)
  })

  it('saveCreatorSelectedRowIds | should create an action to save creator selected row ids', () => {
    const payload = [1, 2, 3]
    const expectedAction = {
      type: types.SAVE_CREATOR_SELECTED_ROW_IDS,
      payload,
    }
    expect(actions.saveCreatorSelectedRowIds(payload)).toEqual(expectedAction)
  })

  it('streamDiscoveryFetchThumbnailRequested | should create an action to fetch thumbnails', () => {
    const payload = {
      nodeIdentifier: 'host8',
      id: '1764',
      streamUrl:
        'rtsp://root:ambient@10.1.13.139/axis-media/media.amp?videocodec=h264&resolution=640x480',
    }
    const expectedAction = {
      type: types.FETCH_THUMBNAIL_REQUESTED,
      payload,
    }
    expect(actions.streamDiscoveryFetchThumbnailRequested(payload)).toEqual(
      expectedAction,
    )
  })

  it('streamDiscoveryFetchThumbnailSucceeded | should create an action to handle thubnails response', () => {
    const payload = {
      data: { ok: true },
    }
    const expectedAction = {
      type: types.FETCH_THUMBNAIL_SUCCEEDED,
      payload: payload.data,
    }
    expect(actions.streamDiscoveryFetchThumbnailSucceeded(payload)).toEqual(
      expectedAction,
    )
  })

  it('streamDiscoveryFetchThumbnailFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: types.FETCH_THUMBNAIL_FAILED,
      payload: payload.error,
      error: true,
    }
    expect(actions.streamDiscoveryFetchThumbnailFailed(payload)).toEqual(
      expectedAction,
    )
  })

  it('clearStreamDiscoveryState | should create an action to clear stream discovery', () => {
    const expectedAction = {
      type: types.CLEAR_STREAM_DISCOVERY,
    }
    expect(actions.clearStreamDiscoveryState()).toEqual(expectedAction)
  })
})
