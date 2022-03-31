import reducer, { initialState } from './index'
import * as actions from './index'
import {
  TEST_SITE,
  TEST_STREAM,
  TEST_VIDEO_WALL,
  TEST_STREAM_FEED,
  TEST_USER,
  TEST_TEMPLATE,
} from './mockData'

describe('Operator Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle fetchVideoWallRequested', () => {
    expect(
      reducer(initialState, {
        type: actions.fetchVideoWallRequested.type,
        payload: { accountSlug: 'acme' },
      }),
    ).toEqual({
      ...initialState,
      videoWallLoading: true,
    })
  })

  it('should handle fetchVideoWallSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          videoWallLoading: true,
        },
        {
          type: actions.fetchVideoWallSucceeded.type,
          payload: { videoWall: TEST_VIDEO_WALL },
        },
      ),
    ).toEqual({
      ...initialState,
      videoWallLoading: false,
      videoWall: TEST_VIDEO_WALL,
    })
  })

  it('should handle fetchVideoWallFailed', () => {
    expect(
      reducer(
        {
          ...initialState,
          videoWallLoading: true,
        },
        {
          type: actions.fetchVideoWallFailed.type,
          payload: { error: 'ERROR' },
        },
      ),
    ).toEqual({
      ...initialState,
      videoWallLoading: false,
      error: 'ERROR',
    })
  })

  it('should handle fetchSitesRequested', () => {
    expect(
      reducer(initialState, {
        type: actions.fetchSitesRequested.type,
        payload: { accountSlug: 'acme' },
      }),
    ).toEqual({
      ...initialState,
      sitesLoading: true,
    })
  })

  it('should handle fetchSitesSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          sitesLoading: true,
        },
        {
          type: actions.fetchSitesSucceeded.type,
          payload: { sites: [TEST_SITE] },
        },
      ),
    ).toEqual({
      ...initialState,
      sitesLoading: false,
      sites: [TEST_SITE],
    })
  })

  it('should handle fetchSitesFailed', () => {
    expect(
      reducer(
        {
          ...initialState,
          sitesLoading: true,
        },
        {
          type: actions.fetchSitesFailed.type,
          payload: { error: 'ERROR' },
        },
      ),
    ).toEqual({
      ...initialState,
      sitesLoading: false,
      error: 'ERROR',
    })
  })

  it('should handle fetchStreamsRequested', () => {
    expect(
      reducer(initialState, {
        type: actions.fetchStreamsRequested.type,
        payload: { accountSlug: 'acme' },
      }),
    ).toEqual({
      ...initialState,
      streamsLoading: true,
    })
  })

  it('should handle fetchStreamsSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          streamsLoading: true,
        },
        {
          type: actions.fetchStreamsSucceeded.type,
          payload: { streams: [TEST_STREAM] },
        },
      ),
    ).toEqual({
      ...initialState,
      streamsLoading: false,
      streams: [TEST_STREAM],
    })
  })

  it('should handle fetchStreamsFailed', () => {
    expect(
      reducer(
        {
          ...initialState,
          streamsLoading: true,
        },
        {
          type: actions.fetchStreamsFailed.type,
          payload: { error: 'ERROR' },
        },
      ),
    ).toEqual({
      ...initialState,
      streamsLoading: false,
      error: 'ERROR',
    })
  })

  it('should handle fetchStreamSnapShotRequested', () => {
    expect(
      reducer(
        {
          ...initialState,
          streams: [TEST_STREAM],
        },
        {
          type: actions.fetchStreamSnapShotRequested.type,
          payload: { streamId: TEST_STREAM.id },
        },
      ),
    ).toEqual({
      ...initialState,
      streams: [{ ...TEST_STREAM, snapshotLoading: true }],
    })
  })

  it('should handle fetchStreamSnapShotSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          streams: [{ ...TEST_STREAM, snapshotLoading: true }],
        },
        {
          type: actions.fetchStreamSnapShotSucceeded.type,
          payload: { stream: { id: TEST_STREAM.id, snapshot: null } },
        },
      ),
    ).toEqual({
      ...initialState,
      streamsLoading: false,
      streams: [{ ...TEST_STREAM, snapshotLoading: false, snapshot: null }],
    })
  })

  it('should handle updateVideoWallRequested', () => {
    expect(
      reducer(initialState, {
        type: actions.updateVideoWallRequested.type,
      }),
    ).toEqual({
      ...initialState,
      editLoading: true,
    })
  })

  it('should handle updateVideoWallSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          editLoading: true,
        },
        {
          type: actions.updateVideoWallSucceeded.type,
          payload: { videoWall: TEST_VIDEO_WALL },
        },
      ),
    ).toEqual({
      ...initialState,
      editLoading: false,
      videoWall: TEST_VIDEO_WALL,
    })
  })

  it('should handle updateVideoWallFailed', () => {
    expect(
      reducer(
        {
          ...initialState,
          editLoading: true,
        },
        {
          type: actions.updateVideoWallFailed.type,
          payload: { error: 'ERROR' },
        },
      ),
    ).toEqual({
      ...initialState,
      editLoading: false,
      error: 'ERROR',
    })
  })

  it('should handle updateStreamFeedRequested', () => {
    const payload = {
      videoWallId: 167,
      streamId: 292,
      orderIndex: 4,
    }
    expect(
      reducer(initialState, {
        type: actions.updateStreamFeedRequested.type,
        payload,
      }),
    ).toEqual({
      ...initialState,
      streamFeedLoading: true,
    })
  })

  it('should handle updateStreamFeedSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          videoWall: TEST_VIDEO_WALL,
          streamFeedLoading: true,
        },
        {
          type: actions.updateStreamFeedSucceeded.type,
          payload: { streamFeed: TEST_STREAM_FEED },
        },
      ),
    ).toEqual({
      ...initialState,
      videoWall: TEST_VIDEO_WALL,
      streamFeedLoading: false,
    })
  })

  it('should handle updateStreamFeedFailed', () => {
    expect(
      reducer(
        {
          ...initialState,
          streamFeedLoading: true,
        },
        {
          type: actions.updateStreamFeedFailed.type,
          payload: { error: 'ERROR' },
        },
      ),
    ).toEqual({
      ...initialState,
      streamFeedLoading: false,
      error: 'ERROR',
    })
  })

  it('should handle fetchUsersRequested', () => {
    expect(
      reducer(initialState, {
        type: actions.fetchUsersRequested.type,
        payload: { accountSlug: 'acme' },
      }),
    ).toEqual({
      ...initialState,
      usersLoading: true,
    })
  })

  it('should handle fetchUsersSucceeded', () => {
    expect(
      reducer(
        {
          ...initialState,
          usersLoading: true,
        },
        {
          type: actions.fetchUsersSucceeded.type,
          payload: { users: [TEST_USER] },
        },
      ),
    ).toEqual({
      ...initialState,
      usersLoading: false,
      users: [TEST_USER],
    })
  })

  it('should handle fetchUsersFailed', () => {
    expect(
      reducer(
        {
          ...initialState,
          usersLoading: true,
        },
        {
          type: actions.fetchUsersFailed.type,
          payload: { error: 'ERROR' },
        },
      ),
    ).toEqual({
      ...initialState,
      usersLoading: false,
      error: 'ERROR',
    })
  })

  it('should handle toggleStreamCell', () => {
    const payload = { orderIndex: 0, stream: TEST_STREAM }
    expect(
      reducer(
        { ...initialState, videoWall: TEST_VIDEO_WALL },
        {
          type: actions.toggleStreamCell.type,
          payload,
        },
      ),
    ).toEqual({
      ...initialState,
      videoWall: {
        ...TEST_VIDEO_WALL,
        streamFeeds: [{ ...TEST_STREAM_FEED, streamId: TEST_STREAM.id }],
      },
    })
  })

  it('should handle selectVideoWallTemplate', () => {
    expect(
      reducer(
        { ...initialState, videoWall: TEST_VIDEO_WALL },
        {
          type: actions.selectVideoWallTemplate.type,
          payload: { template: TEST_TEMPLATE },
        },
      ),
    ).toEqual({
      ...initialState,
      videoWall: {
        ...TEST_VIDEO_WALL,
        template: TEST_TEMPLATE,
      },
    })
  })

  it('should handle removeAlert', () => {
    const alert = { id: 1, siteSlug: 'host8' }
    expect(
      reducer(
        { ...initialState, alerts: [alert] },
        {
          type: actions.removeAlert.type,
          payload: { alertEventId: 1 },
        },
      ),
    ).toEqual({
      ...initialState,
      alerts: [],
    })
  })

  it('should handle setActiveAlert', () => {
    const alert = { id: 1, siteSlug: 'host8' }
    expect(
      reducer(
        { ...initialState, alerts: [alert] },
        {
          type: actions.setActiveAlert.type,
          payload: { alert },
        },
      ),
    ).toEqual({
      ...initialState,
      alerts: [{ ...alert, seen: true }],
      activeAlert: alert,
    })
  })
})
