/*
 * Author: Benjamin Shapero (bshapero@ambient.ai)
 * Copyright Ambient.ai 2020
 */
import {
  WebRTCMessageTypeEnum,
  StreamStateEnum,
  StreamTypeUpdatedEnum,
} from '../../enums'
import reducer, {
  initVideoStreamFeed,
  attachTrack,
  sendP2PMessageSucceeded,
  updateStreamStatus,
  setVideoStreamFeedValues,
  //  disconnectedAt,
  fetchStreamSnapshotRequested,
} from '../../redux/slices/webrtc'

const initialState = {
  streams: {},
  p2pMessageStatus: 'succeeded',
  p2pId: null,
  p2pLoading: false,
  p2pActive: false,
  inError: false,
}

const errorState = { ...initialState, inError: true }

/// //// Default payloads to initVideoStreamFeed
const initVideoStreamFeedPayload1 = {
  videoStreamKey: 'test',
  props: {
    initTs: 1234567890,
    mode: StreamTypeUpdatedEnum.RECORDED,
    streamId: '1',
    nodeId: 'host2',
    requestTs: 1234567890000,
    ts: 1234567890000,
    willAutoLoad: true,
  },
}

const initVideoStreamFeedPayload2 = {
  videoStreamKey: 'test',
  props: {
    initTs: null,
    mode: StreamTypeUpdatedEnum.SPE,
    streamId: '3',
    nodeId: 'host2',
    requestTs: null,
    ts: null,
    willAutoLoad: true,
  },
}
/// //// Sample requestStream payloads. Can extend this in expect()
const defaultRequestStreamPayload = {
  videoStreamKey: 'test',
  nodeId: 'host2',
  data: {
    type: WebRTCMessageTypeEnum.REQUEST_STREAM,
    mode: StreamTypeUpdatedEnum.SPE,
    streamid: '1',
    trackid: 'play-time-good-game',
    ts: null,
  },
}

/// ////

// Sample "state" data for testing
const loadingStream1 = {
  test: {
    status: StreamStateEnum.LOADING,
    oldTrackId: 'play-time-good-game',
    initTs: 1234567890,
    requestTs: 1234567890000,
    ts: 1234567890000,
    syncTs: 1234567890000,
    mode: StreamTypeUpdatedEnum.RECORDED,
    streamId: '1',
    nodeId: 'host2',
    willAutoLoad: true,
  },
}

const loadingStream2 = {
  test: {
    status: StreamStateEnum.LOADING,
    oldTrackId: 'next-last-room-play',
    initTs: null,
    mode: StreamTypeUpdatedEnum.SPE,
    streamId: '3',
    nodeId: 'host2',
    willAutoLoad: true,
  },
}

const playingStream1 = {
  test: {
    status: StreamStateEnum.PLAYING,
    oldTrackId: 'play-time-good-game',
    newTrackId: 'MediaStream-real-play-time-name',
    initTs: 1234567890,
    ts: 1235567890000,
    requestTs: 1235567890000,
    syncTs: 1235567890000,
    mode: StreamTypeUpdatedEnum.RECORDED,
    streamId: '1',
    nodeId: 'host2',
    willAutoLoad: true,
  },
}

const playingStream2 = {
  test: {
    status: StreamStateEnum.PLAYING,
    oldTrackId: 'next-last-room-play',
    newTrackId: 'MediaStream-four-play-dead-beef',
    mode: StreamTypeUpdatedEnum.SPE,
    streamId: '3',
    nodeId: 'host2',
    willAutoLoad: true,
  },
}

const archivalPayload1 = {
  nodeId: 'host2',
  videoStreamKey: 'test',
  data: {
    type: WebRTCMessageTypeEnum.ARCHIVAL,
    streamid: playingStream1.test.streamId,
    trackid: playingStream1.test.oldTrackId,
    data: {
      command: 'ts',
      ts: 1234568790000,
    },
  },
}

describe('reducers', () => {
  it('initializing component state', () => {
    expect(
      reducer(initialState, {
        type: initVideoStreamFeed.type,
        payload: initVideoStreamFeedPayload1,
      }).streams,
    ).toEqual({
      test: initVideoStreamFeedPayload1.props,
    })
  })

  it('post-request should be in LOADING state', () => {
    // If videoStreamKey not in state.streams, does nothing
    expect(
      reducer(initialState, {
        type: sendP2PMessageSucceeded.type,
        payload: defaultRequestStreamPayload,
      }).streams,
    ).toEqual({})
    // If videoStreamKey in state.streams, sets status and ts values
    expect(
      reducer(
        {
          ...initialState,
          streams: { test: {} },
        },
        {
          type: sendP2PMessageSucceeded.type,
          payload: defaultRequestStreamPayload,
        },
      ).streams,
    ).toEqual({
      test: {
        status: StreamStateEnum.LOADING,
        oldTrackId: defaultRequestStreamPayload.data.trackid,
        requestTs: null,
        ts: null,
        syncTs: null,
      },
    })
    const requestTs = 1234567890000
    const recordedRequestStreamPayload = {
      ...defaultRequestStreamPayload,
      data: {
        ...defaultRequestStreamPayload.data,
        mode: StreamTypeUpdatedEnum.RECORDED,
        ts: requestTs,
      },
    }
    expect(
      reducer(
        {
          ...initialState,
          streams: { test: {} },
        },
        {
          type: sendP2PMessageSucceeded.type,
          payload: recordedRequestStreamPayload,
        },
      ).streams,
    ).toEqual({
      test: {
        status: StreamStateEnum.LOADING,
        oldTrackId: defaultRequestStreamPayload.data.trackid,
        requestTs,
        ts: requestTs,
        syncTs: requestTs,
      },
    })
  })

  it('Attaching track only changes newTrackId if in ASSIGNED state', () => {
    const payload = {
      videoStreamKey: 'test',
      mediaStream: { id: 'MediaStream-four-play-dead-beef' },
    }
    expect(
      reducer(
        {
          ...initialState,
          streams: {
            test: {
              status: StreamStateEnum.READY,
              mode: StreamTypeUpdatedEnum.RECORDED,
              streamId: '3',
              oldTrackId: 'abcd-efgh-ijkl-mnop',
              newTrackId: 'dead-beef-dead-beef',
            },
          },
        },
        {
          type: attachTrack.type,
          payload,
        },
      ),
    ).toEqual({
      ...initialState,
      streams: {
        test: {
          status: StreamStateEnum.READY,
          mode: StreamTypeUpdatedEnum.RECORDED,
          streamId: '3',
          oldTrackId: 'abcd-efgh-ijkl-mnop',
          newTrackId: 'dead-beef-dead-beef',
        },
      },
    })

    expect(
      reducer(
        {
          ...initialState,
          streams: {
            test: {
              status: StreamStateEnum.ASSIGNED,
              mode: StreamTypeUpdatedEnum.SPE,
              nodeId: 'host2',
              streamId: '3',
              oldTrackId: 'next-last-room-play',
              newTrackId: 'dead-beef-dead-beef',
              willAutoLoad: true,
            },
          },
        },
        {
          type: attachTrack.type,
          payload,
        },
      ),
    ).toEqual({
      ...initialState,
      streams: {
        test: {
          ...playingStream2.test,
          status: StreamStateEnum.PLAYING,
          willAutoLoad: true,
        },
      },
    })
  })

  it('Hanging up track clears oldTrackId and ts', () => {
    expect(
      reducer(
        {
          ...initialState,
          streams: { ...playingStream1 },
        },
        {
          type: sendP2PMessageSucceeded.type,
          payload: {
            videoStreamKey: 'test',
            nodeId: 'host2',
            data: {
              type: WebRTCMessageTypeEnum.HANG_UP,
              trackid: playingStream1.test.newTrackId,
            },
          },
        },
      ),
    ).toEqual({
      ...initialState,
      streams: {
        test: {
          ...playingStream1.test,
          status: StreamStateEnum.HANGING_UP,
          oldTrackId: null,
          ts: null,
          syncTs: null,
        },
      },
    })
  })

  it('Archival requests change ts, even if not in RECORDED mode', () => {
    expect(
      reducer(
        {
          ...initialState,
          streams: { ...playingStream1 },
        },
        {
          type: sendP2PMessageSucceeded.type,
          payload: archivalPayload1,
        },
      ),
    ).toEqual({
      ...initialState,
      streams: {
        test: {
          ...playingStream1.test,
          ts: archivalPayload1.data.ts,
          syncTs: archivalPayload1.data.ts,
        },
      },
    })
  })

  it('Assigning a track sets the newTrackId, but only from ASSIGNED state.', () => {
    const attachTrackPayload = {
      videoStreamKey: 'test',
      mediaStream: { id: 'MediaStream-deadbeef' },
    }
    expect(
      reducer(
        {
          ...initialState,
          streams: { test: {} },
        },
        {
          type: attachTrack.type,
          payload: attachTrackPayload,
        },
      ).streams,
    ).toEqual({ test: {} })
    expect(
      reducer(
        {
          ...initialState,
          streams: {
            test: {
              status: StreamStateEnum.ASSIGNED,
              willAutoLoad: true,
            },
          },
        },
        {
          type: attachTrack.type,
          payload: attachTrackPayload,
        },
      ).streams,
    ).toEqual({
      test: {
        newTrackId: attachTrackPayload.mediaStream.id,
        status: StreamStateEnum.PLAYING,
        willAutoLoad: true,
      },
    })
  })

  it('ERROR state should be permanent, all operations fail', () => {
    expect(
      reducer(errorState, {
        type: sendP2PMessageSucceeded.type,
        payload: archivalPayload1,
      }),
    ).toEqual(errorState)

    expect(
      reducer(errorState, {
        type: sendP2PMessageSucceeded.type,
        payload: {
          videoStreamKey: 'test',
          nodeId: 'host2',
          data: {
            type: WebRTCMessageTypeEnum.REQUEST_STREAM,
            mode: StreamTypeUpdatedEnum.RECORDED,
            streamid: '1',
            trackid: 'play-time-good-game',
            ts: 1234567890000,
          },
        },
      }),
    ).toEqual(errorState)

    expect(
      reducer(errorState, {
        type: updateStreamStatus.type,
        payload: {
          videoStreamKey: 'test',
          status: StreamStateEnum.HANGING_UP,
        },
      }),
    ).toEqual(errorState)

    // setVideoStreamFeedValues can set arbitrary fields, but not if in ERROR state
    expect(
      reducer(errorState, {
        type: setVideoStreamFeedValues.type,
        payload: {
          ...loadingStream2.test,
          videoStreamKey: 'test',
        },
      }),
    ).toEqual(errorState)
  })
})
