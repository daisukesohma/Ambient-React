import * as actions from './index'
import {
  TEST_SITE,
  TEST_STREAM,
  TEST_VIDEO_WALL,
  TEST_STREAM_FEED,
  TEST_USER,
  TEST_TEMPLATE,
} from './mockData'

describe('operator actions', () => {
  it('fetchSitesRequested | should create an action to fetch sites', () => {
    const payload = { accountSlug: 'acme' }
    const expectedAction = {
      type: actions.fetchSitesRequested.type,
      payload,
    }
    expect(actions.fetchSitesRequested(payload)).toEqual(expectedAction)
  })

  it('fetchSitesSucceeded | should create an action to store fetched sites', () => {
    const payload = { sites: [TEST_SITE] }
    const expectedAction = {
      type: actions.fetchSitesSucceeded.type,
      payload,
    }
    expect(actions.fetchSitesSucceeded(payload)).toEqual(expectedAction)
  })

  it('fetchSitesFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.fetchSitesFailed.type,
      payload,
    }
    expect(actions.fetchSitesFailed(payload)).toEqual(expectedAction)
  })

  it('fetchStreamsRequested | should create an action to fetch streams', () => {
    const payload = { accountSlug: 'acme' }
    const expectedAction = {
      type: actions.fetchStreamsRequested.type,
      payload,
    }
    expect(actions.fetchStreamsRequested(payload)).toEqual(expectedAction)
  })

  it('fetchStreamsSucceeded | should create an action to store fetched streams', () => {
    const payload = { streams: [TEST_STREAM] }
    const expectedAction = {
      type: actions.fetchStreamsSucceeded.type,
      payload,
    }
    expect(actions.fetchStreamsSucceeded(payload)).toEqual(expectedAction)
  })

  it('fetchStreamsFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.fetchStreamsFailed.type,
      payload,
    }
    expect(actions.fetchStreamsFailed(payload)).toEqual(expectedAction)
  })

  it('fetchStreamSnapShotRequested | should create an action to fetch stream snapshot', () => {
    const payload = { streamId: 289 }
    const expectedAction = {
      type: actions.fetchStreamSnapShotRequested.type,
      payload,
    }
    expect(actions.fetchStreamSnapShotRequested(payload)).toEqual(
      expectedAction,
    )
  })

  it('fetchStreamSnapShotSucceeded | should create an action to store fetched stream snapshot', () => {
    const payload = { stream: { id: 1, stream: null } }
    const expectedAction = {
      type: actions.fetchStreamSnapShotSucceeded.type,
      payload,
    }
    expect(actions.fetchStreamSnapShotSucceeded(payload)).toEqual(
      expectedAction,
    )
  })

  it('fetchStreamSnapShotFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.fetchStreamSnapShotFailed.type,
      payload,
    }
    expect(actions.fetchStreamSnapShotFailed(payload)).toEqual(expectedAction)
  })

  it('fetchVideoWallRequested | should create an action to fetch video wall', () => {
    const payload = { accountSlug: 'acme' }
    const expectedAction = {
      type: actions.fetchVideoWallRequested.type,
      payload,
    }
    expect(actions.fetchVideoWallRequested(payload)).toEqual(expectedAction)
  })

  it('fetchVideoWallSucceeded | should create an action to store fetched video wall', () => {
    const payload = { videoWall: TEST_VIDEO_WALL }
    const expectedAction = {
      type: actions.fetchVideoWallSucceeded.type,
      payload,
    }
    expect(actions.fetchVideoWallSucceeded(payload)).toEqual(expectedAction)
  })

  it('fetchVideoWallFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.fetchVideoWallFailed.type,
      payload,
    }
    expect(actions.fetchVideoWallFailed(payload)).toEqual(expectedAction)
  })

  it('updateVideoWallRequested | should create an action to update video wall', () => {
    const expectedAction = {
      type: actions.updateVideoWallRequested.type,
    }
    expect(actions.updateVideoWallRequested()).toEqual(expectedAction)
  })

  it('updateVideoWallSucceeded | should create an action to store updated video wall', () => {
    const payload = { videoWall: TEST_VIDEO_WALL }
    const expectedAction = {
      type: actions.updateVideoWallSucceeded.type,
      payload,
    }
    expect(actions.updateVideoWallSucceeded(payload)).toEqual(expectedAction)
  })

  it('updateVideoWallFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.updateVideoWallFailed.type,
      payload,
    }
    expect(actions.updateVideoWallFailed(payload)).toEqual(expectedAction)
  })

  it('updateStreamFeedRequested | should create an action to update stream feeds', () => {
    const payload = {
      videoWallId: 167,
      streamId: 292,
      orderIndex: 4,
    }
    const expectedAction = {
      type: actions.updateStreamFeedRequested.type,
      payload,
    }
    expect(actions.updateStreamFeedRequested(payload)).toEqual(expectedAction)
  })

  it('updateStreamFeedSucceeded | should create an action to store updated stream feeds', () => {
    const payload = { streamFeed: TEST_STREAM_FEED }
    const expectedAction = {
      type: actions.updateStreamFeedSucceeded.type,
      payload,
    }
    expect(actions.updateStreamFeedSucceeded(payload)).toEqual(expectedAction)
  })

  it('updateStreamFeedFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.updateStreamFeedFailed.type,
      payload,
    }
    expect(actions.updateStreamFeedFailed(payload)).toEqual(expectedAction)
  })

  it('fetchUsersRequested | should create an action to fetch users', () => {
    const payload = { accountSlug: 'acme' }
    const expectedAction = {
      type: actions.fetchUsersRequested.type,
      payload,
    }
    expect(actions.fetchUsersRequested(payload)).toEqual(expectedAction)
  })

  it('fetchUsersSucceeded | should create an action to store fetched users', () => {
    const payload = { users: [TEST_USER] }
    const expectedAction = {
      type: actions.fetchUsersSucceeded.type,
      payload,
    }
    expect(actions.fetchUsersSucceeded(payload)).toEqual(expectedAction)
  })

  it('fetchUsersFailed | should create an action to handle failed response', () => {
    const payload = { error: 'ERROR' }
    const expectedAction = {
      type: actions.fetchUsersFailed.type,
      payload,
    }
    expect(actions.fetchUsersFailed(payload)).toEqual(expectedAction)
  })

  it('toggleStreamCell | should create an action to toggle stream cell', () => {
    const payload = { orderIndex: 7, stream: TEST_STREAM }
    const expectedAction = {
      type: actions.toggleStreamCell.type,
      payload,
    }
    expect(actions.toggleStreamCell(payload)).toEqual(expectedAction)
  })

  it('selectVideoWallTemplate | should create an action to select video wall template', () => {
    const payload = { template: TEST_TEMPLATE }
    const expectedAction = {
      type: actions.selectVideoWallTemplate.type,
      payload,
    }
    expect(actions.selectVideoWallTemplate(payload)).toEqual(expectedAction)
  })

  it('addAlert | should create an action to add alert', () => {
    const payload = { alert: { id: 1, siteSlug: 'host8' } }
    const expectedAction = {
      type: actions.addAlert.type,
      payload,
    }
    expect(actions.addAlert(payload)).toEqual(expectedAction)
  })

  it('removeAlert | should create an action to remove alert', () => {
    const payload = { alert: { id: 1, siteSlug: 'host8' } }
    const expectedAction = {
      type: actions.removeAlert.type,
      payload,
    }
    expect(actions.removeAlert(payload)).toEqual(expectedAction)
  })

  it('setActiveAlert | should create an action to set active alert', () => {
    const payload = { alert: { id: 1, siteSlug: 'host8' } }
    const expectedAction = {
      type: actions.setActiveAlert.type,
      payload,
    }
    expect(actions.setActiveAlert(payload)).toEqual(expectedAction)
  })
})
