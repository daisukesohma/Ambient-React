// saga
import {
  put,
  call,
  takeLatest,
  takeLeading,
  takeEvery,
  cancel,
  cancelled,
  delay,
  select,
} from 'redux-saga/effects'
import findKey from 'lodash/findKey'
import get from 'lodash/get'
// src
import getNodeIds from 'selectors/webrtc/getNodeIds'
import { createQuery } from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import {
  setupP2PRequested,
  setupP2PSucceeded,
  setupP2PFailed,
  resetConnectionRequested,
  disconnectP2PRequested,
  disconnectP2PSucceeded,
  disconnectP2PFailed,
  streamingError,
  refreshIceServersSucceeded,
  refreshIceServersFailed,
  sendChannelMessageRequested,
  sendChannelMessageSucceeded,
  sendChannelMessageFailed,
  sendP2PMessageRequested,
  sendP2PMessageSucceeded,
  sendP2PMessageFailed,
  attachTrack,
  //  disconnectedAt,
  updateStreamStatus,
  fetchStreamSnapshotRequested,
  fetchStreamSnapshotSucceeded,
  fetchStreamSnapshotFailed,
  setVideoStreamFeedValues,
  resetHangupRequested,
  clearP2PId,
} from 'redux/slices/webrtc'
import { store } from 'redux/store'
import SignalingChannel from 'webrtc/SignalingChannel'
import { P2P, OwtLogger } from 'webrtc/Owt/index'
import mediaStreams from 'webrtc/mediaStreams'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import {
  WebRTCMessageTypeEnum,
  SignalServerAuthenticationTypeEnum,
  StreamErrorEnum,
  StreamStateEnum,
} from 'enums'
import config from 'config'
import { GET_STREAM_SNAPSHOT } from 'gql/queries'
import * as Sentry from '@sentry/react'

import { GET_ICE_SERVERS } from './gql'
import JWTService from '../../common/services/JWTService'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'

// Total number of tranceivers allowed on a PeerConnection before resetting the connection entirely
const TRANSCEIVER_NUMBER_THRESHOLD = 40

const clientConfiguration = {
  audioEncodings: true,
  videoEncodings: [
    {
      codec: { name: 'h264' },
    },
  ],
  rtcConfiguration: {
    iceServers: [
      {
        urls: ['stun:global.stun.twilio.com:3478?transport=udp'],
      },
      {
        credential: 'TBjiufc/Ft0qfKsngRJ4TolVcKNYbueV28vP/SNBcEg=',
        urls: ['turn:global.turn.twilio.com:3478?transport=udp'],
        username:
          '0ecd1236c65e60c05d616c309f2ea856d868943966982729c3845d19550d1345',
      },
      {
        credential: 'TBjiufc/Ft0qfKsngRJ4TolVcKNYbueV28vP/SNBcEg=',
        urls: ['turn:global.turn.twilio.com:3478?transport=tcp'],
        username:
          '0ecd1236c65e60c05d616c309f2ea856d868943966982729c3845d19550d1345',
      },
      {
        credential: 'TBjiufc/Ft0qfKsngRJ4TolVcKNYbueV28vP/SNBcEg=',
        urls: ['turn:global.turn.twilio.com:443?transport=tcp'],
        username:
          '0ecd1236c65e60c05d616c309f2ea856d868943966982729c3845d19550d1345',
      },
    ],
  },
}
let signalingChannel = null

function* setupP2PConnection(action) {
  try {
    const p2pLoading = yield select(state => state.webrtc.p2pLoading)
    if (!p2pLoading || mediaStreams.p2p !== null) {
      yield cancel()
    }
    // Create new connection
    //  const serverAddress = 'https://example.com:8096';

    // Please change this STUN and TURN server information.

    // Updates with what is on backend
    const { iceServers, authParams } = action.payload

    clientConfiguration.rtcConfiguration.iceServers = iceServers.iceservers.map(
      iceServer => {
        if (iceServer.credential) {
          return {
            urls: iceServer.urls,
            url: iceServer.url,
            username: iceServer.username,
            credential: iceServer.credential,
          }
        }
        return {
          urls: iceServer.urls,
          url: iceServer.url,
        }
      },
    )
    signalingChannel = new SignalingChannel()

    signalingChannel.onMessageNext = (parsedMessage, origin) => {
      if (parsedMessage.type === WebRTCMessageTypeEnum.SYNC) {
        const videoStreamKey = findKey(mediaStreams.streams, el => {
          return el ? el.oldTrackId === parsedMessage.trackid : null
        })
        if (videoStreamKey) {
          store.dispatch(
            setVideoStreamFeedValues({
              videoStreamKey,
              props: { syncTs: Math.floor(parsedMessage.ts) },
            }),
          )
        }
      } else if (parsedMessage.type === WebRTCMessageTypeEnum.NEW_TRACK_ID) {
        const key = findKey(mediaStreams.streams, el => {
          return el ? el.oldTrackId === parsedMessage.oldtrackid : null
        })
        if (key) {
          if (mediaStreams.streams[key].status === StreamStateEnum.LOADING) {
            mediaStreams.streams[key].newTrackId = parsedMessage.newtrackid
            mediaStreams.streams[key].status = StreamStateEnum.ASSIGNED
            store.dispatch(
              updateStreamStatus({
                videoStreamKey: key,
                status: StreamStateEnum.ASSIGNED,
              }),
            )
          } else {
            store.dispatch(
              resetHangupRequested({
                origin,
                trackid: parsedMessage.newtrackid,
              }),
            )
          }
        } else {
          store.dispatch(
            resetHangupRequested({
              origin,
              trackid: parsedMessage.newtrackid,
            }),
          )
        }
      } else if (parsedMessage.type === WebRTCMessageTypeEnum.ERROR) {
        const errorType = parsedMessage.error

        if (errorType === StreamErrorEnum.BLACKLIST) {
          trackEventToMixpanel(MixPanelEventEnum.VMS_PEER_CONNECTION_BLACKLIST)
          //          console.log(`Got BLACKLIST from appliance`)
          store.dispatch(streamingError())
          //          store.dispatch(resetConnectionRequested())
        } else if (errorType === StreamErrorEnum.MAX_CLIENTS) {
          const key = findKey(mediaStreams.streams, el => {
            return el ? el.oldTrackId === parsedMessage.trackid : null
          })
          if (key) {
            mediaStreams.streams[key].status = StreamStateEnum.MAX_CLIENTS
            store.dispatch(
              updateStreamStatus({
                videoStreamKey: key,
                status: StreamStateEnum.MAX_CLIENTS,
              }),
            )
          }
        } else if (
          errorType === StreamErrorEnum.INVALID_MODE ||
          errorType === StreamErrorEnum.INVALID_STREAMID
        ) {
          // Possible component-only error that isn't a global lock. Currently will autoRetry.
        }
      }
    }

    signalingChannel.onClientDisconnected = () => {
      store.dispatch(
        createNotification({
          message:
            'Unable to connect to the Ambient.ai servers. Please check you are connected to the internet and refresh your browser.',
        }),
      )
    }

    // Set OWT logging level
    OwtLogger.setLogLevel(OwtLogger.INFO)

    mediaStreams.p2p = new P2P.P2PClient(clientConfiguration, signalingChannel)

    mediaStreams.p2p.addEventListener(WebRTCMessageTypeEnum.STREAM_ADDED, e => {
      // 5 Seconds after stream arrives, check count of incoming frames, hangup if BSOD
      const blackscreenTimeout = setTimeout(() => {
        e.receiver.getStats().then(stats => {
          stats.forEach(report => {
            if (report.type === 'inbound-rtp' && report.framesReceived === 0) {
              const scope = new Sentry.Scope()
              scope.setTag('node_id', e.stream.origin)
              const keyWhenBsod = findKey(mediaStreams.streams, el => {
                return el ? el.newTrackId === e.stream.mediaStream.id : null
              })
              if (keyWhenBsod) {
                const bsodStreamId = get(
                  mediaStreams.streams[keyWhenBsod],
                  'streamId',
                  null,
                )
                const bsodMode = get(
                  mediaStreams.streams[keyWhenBsod],
                  'mode',
                  null,
                )
                Sentry.captureException('Black Screen of Death detected', scope)
                trackEventToMixpanel(MixPanelEventEnum.VMS_BSOD, {
                  node_id: e.stream.origin,
                  stream_id: bsodStreamId,
                  mode: bsodMode,
                })
                mediaStreams.streams[keyWhenBsod].bsodDetected = true
                store.dispatch(
                  sendP2PMessageRequested({
                    videoStreamKey: keyWhenBsod,
                    nodeId: e.stream.origin,
                    data: {
                      type: WebRTCMessageTypeEnum.HANG_UP,
                      trackid: e.stream.mediaStream.id,
                    },
                  }),
                )
              } else {
                store.dispatch(
                  resetHangupRequested({
                    origin: e.stream.origin,
                    trackid: e.stream.mediaStream.id,
                  }),
                )
              }
            }
          })
        })
      }, 5000)

      const keyWhenAdded = findKey(mediaStreams.streams, el => {
        return el ? el.newTrackId === e.stream.mediaStream.id : null
      })

      if (keyWhenAdded) {
        // Fire this when stream ends for any reason, even if another request/hangup cycle has started.
        // Depending on state, may indicate a network outage
        e.stream.addEventListener(WebRTCMessageTypeEnum.ENDED, () => {
          // A new request/hangup cycle may have started before the stream ended, so check
          // if the ending stream is still the current cycle. If it is the current cycle,
          // finish the cycle by moving to READY or DISCONNECTED. If its from an old cycle,
          // nothing else to do.
          const keyWhenEnded = findKey(mediaStreams.streams, el => {
            return el ? el.newTrackId === e.stream.mediaStream.id : null
          })
          // Remove listener once fired to prevent memory leaks.
          e.stream.clearEventListener(WebRTCMessageTypeEnum.ENDED)
          clearTimeout(blackscreenTimeout)

          if (keyWhenEnded) {
            if (
              mediaStreams.streams[keyWhenEnded].status ===
              StreamStateEnum.HANGING_UP
            ) {
              // Finally stop playing on <video> element
              mediaStreams.streams[keyWhenEnded].mediaStream = null
              mediaStreams.streams[keyWhenEnded].newTrackId = null
              mediaStreams.streams[keyWhenEnded].status = StreamStateEnum.READY
            } else {
              // Don't remove from <video> yet, nothing can replace it until reconnected.
              // TODO:? (Maybe throw up preview snapshot instead?)
              mediaStreams.streams[keyWhenEnded].status =
                StreamStateEnum.DISCONNECTED
            }
            store.dispatch(
              updateStreamStatus({
                videoStreamKey: keyWhenEnded,
                status: mediaStreams.streams[keyWhenEnded].status,
              }),
            )
          }
        })

        // Follow state transition
        if (
          mediaStreams.streams[keyWhenAdded].status === StreamStateEnum.ASSIGNED
        ) {
          mediaStreams.streams[keyWhenAdded].mediaStream = e.stream.mediaStream
          mediaStreams.streams[keyWhenAdded].status = StreamStateEnum.PLAYING
          store.dispatch(
            attachTrack({
              videoStreamKey: keyWhenAdded,
              mediaStream: e.stream.mediaStream,
            }),
          )
        } else {
          // Found mediaStream with e.stream.mediaStream.id, but not in ASSIGNED state.
          clearTimeout(blackscreenTimeout)
          store.dispatch(
            resetHangupRequested({
              origin: e.stream.origin,
              trackid: e.stream.mediaStream.id,
            }),
          )
        }
      } else {
        // No mediaStream with e.stream.mediaStream.id, component was removed.
        console.log(
          `stream ${e.stream.mediaStream.id} arrived but component already moved on`,
        )
        clearTimeout(blackscreenTimeout)
        store.dispatch(
          resetHangupRequested({
            origin: e.stream.origin,
            trackid: e.stream.mediaStream.id,
          }),
        )
      }
    })
    const p2pId = yield select(state => state.webrtc.p2pId)

    if (authParams) {
      const { nodeIds } = authParams
      // Reuse old socket id
      if (p2pId) {
        authParams.prevId = p2pId
      }

      if (nodeIds) {
        for (let i = 0; i < nodeIds.length; ++i) {
          mediaStreams.p2p.allowedRemoteIds.push(nodeIds[i])
        }
      }
    }
    const p2pActive = yield select(state => state.webrtc.p2pActive)
    if (!p2pActive) {
      mediaStreams.p2p
        .connect({
          host: config.signalBridgeOwt,
          authParams,
        })
        .then(uid => {
          store.dispatch(setupP2PSucceeded({ p2pId: decodeURI(uid) }))
        })
        .catch(error => {
          const { message } = error
          store.dispatch(setupP2PFailed({ message }))
        })
    } else {
      console.log(`Already connected to signal server`)
    }
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(setupP2PFailed({ message }))
  } finally {
    if (yield cancelled()) {
      //      yield put(setupP2PSucceeded())
    }
  }
}

function* resetConnection(action) {
  // Reset if over threshold
  // Reset PeerConnection
  store.dispatch(
    createNotification({
      message: 'Resetting connection to Ambient.ai servers. Please wait...',
    }),
  )
  yield put(clearP2PId())
  yield put(disconnectP2PRequested())

  const oldToken = yield select(state => state.auth.token)
  const token = yield call(JWTService.migrateToken, oldToken)
  const nodeIds = yield select(getNodeIds)

  let authParams = null
  if (token) {
    authParams = {
      type: SignalServerAuthenticationTypeEnum.BROWSER,
      token,
      nodeIds,
    }
  }
  yield put(setupP2PRequested({ authParams }))
}

// This sends messages directly to the video channel
// We use this to play 1x,2x, etc speeds and to pause/etc.
// expected data = {'command':'next', 'streamid': str(streamId), 'trackid': oldTrackId})
// expected commands: ['next', 'previous', 'pause', 'unpause', 'speed']
//
function* sendChannelMessage(action) {
  try {
    if (mediaStreams.p2p !== null) {
      mediaStreams.p2p
        .send(action.payload.nodeId, JSON.stringify(action.payload.data))
        .then(() => {
          store.dispatch(sendChannelMessageSucceeded(action.payload))
        })
        .catch(error => {
          store.dispatch(sendChannelMessageFailed(action.payload))
        })
    }
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(sendChannelMessageFailed({ message }))
  }
}

function* sendP2PMessage(action) {
  try {
    const p2pActive = yield select(state => state.webrtc.p2pActive)
    const p2pLoading = yield select(state => state.webrtc.p2pLoading)
    if (p2pActive) {
      if (action.payload.data.type === WebRTCMessageTypeEnum.HANG_UP) {
        // Check to see if there are too many transceivers
        if (mediaStreams.p2p) {
          if (!mediaStreams.nodeStreamCounts[action.payload.nodeId]) {
            // Set if this is the first time
            mediaStreams.nodeStreamCounts[action.payload.nodeId] = 0
          }

          // Add to nodeStream count
          mediaStreams.nodeStreamCounts[action.payload.nodeId] += 1

          if (
            mediaStreams.nodeStreamCounts[action.payload.nodeId] >
            TRANSCEIVER_NUMBER_THRESHOLD
          ) {
            mediaStreams.nodeStreamCounts[action.payload.nodeId] = 0
            trackEventToMixpanel(MixPanelEventEnum.VMS_PEER_CONNECTION_RESET, {
              node_id: action.payload.nodeId,
            })
            mediaStreams.p2p.stop(action.payload.nodeId)
          }
        }
      }

      signalingChannel
        .send(action.payload.nodeId, JSON.stringify(action.payload.data))
        .then(() => {
          if (action.payload.data.type === WebRTCMessageTypeEnum.EXPORT) {
            store.dispatch(createNotification({ message: 'Export finished' }))
            trackEventToMixpanel(MixPanelEventEnum.VMS_ARCHIVE_EXPORTED)
          }
          // Now update redux state to match mediaStreams
          store.dispatch(sendP2PMessageSucceeded(action.payload))
        })
        .catch(message => {
          store.dispatch(sendP2PMessageFailed({ message }))
          if (action.payload.data.type === WebRTCMessageTypeEnum.HANG_UP) {
            delay(5000, put(sendP2PMessageRequested(action)))
          }
        })
    } else if (p2pLoading) {
      if (action.payload.data.type === WebRTCMessageTypeEnum.HANG_UP) {
        delay(5000, put(sendP2PMessageRequested(action)))
      } else {
        console.log(
          `Could not send message of type ${action.payload.data.type}`,
        )
        yield put(sendP2PMessageFailed())
      }
    } else {
      const oldToken = yield select(state => state.auth.token)
      const token = yield call(JWTService.migrateToken, oldToken)
      const nodeIds = yield select(getNodeIds)

      let authParams = null
      if (token) {
        authParams = {
          type: SignalServerAuthenticationTypeEnum.BROWSER,
          token,
          nodeIds,
        }
      }
      yield put(setupP2PRequested({ authParams }))
    }
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(sendP2PMessageFailed({ message }))
    if (action.payload.data.type === WebRTCMessageTypeEnum.HANG_UP) {
      delay(5000, put(sendP2PMessageRequested(action)))
    }
  }
}

// Declare a hangup callback that won't affect redux state or mediaStreams.
// Each requeststream/hangup cycle follows a set sequence of States:
// READY -> LOADING -> ASSIGNED -> [PLAYING/STOPPED] -> HANGING_UP -> READY
// Each cycle has a unique uuid (the oldTrackId) that distinguishes which cycle
// is the current cycle. If any events from an old cycle come in after a new cycle
// has already begun, the streams must be hung up immediately, but without changing
// redux state, since only the current cycle should modify the state.
// Only used to recover from invalid states.
function* resetHangup(action) {
  try {
    const { origin, trackid } = action.payload
    const message = JSON.stringify({
      type: WebRTCMessageTypeEnum.HANG_UP,
      trackid,
    })
    if (!mediaStreams.nodeStreamCounts[origin]) {
      // Set if this is the first time
      mediaStreams.nodeStreamCounts[origin] = 0
    }

    // Add to nodeStream count
    mediaStreams.nodeStreamCounts[origin] += 1
    if (mediaStreams.nodeStreamCounts[origin] > TRANSCEIVER_NUMBER_THRESHOLD) {
      mediaStreams.nodeStreamCounts[origin] = 0
      trackEventToMixpanel(MixPanelEventEnum.VMS_PEER_CONNECTION_RESET, {
        node_id: origin,
      })
      mediaStreams.p2p.stop(origin)
    }
    signalingChannel
      .send(origin, message)
      .then()
      .catch(err => {
        // Keep retrying until it succeeds, otherwise appliance will leak
        delay(5000, put(resetHangup(action)))
      })
  } catch (error) {
    yield delay(5000, put(resetHangup(action)))
  }
}

function* disconnectP2PConnection(action) {
  try {
    Object.keys(mediaStreams.streams).forEach(videoStreamKey => {
      mediaStreams.streams[videoStreamKey].status = StreamStateEnum.HANGING_UP
    })
    if (mediaStreams.p2p) {
      mediaStreams.p2p.disconnect()
      mediaStreams.p2p.clearEventListener(WebRTCMessageTypeEnum.STREAM_ADDED)
      mediaStreams.p2p = null
    }
    yield put(disconnectP2PSucceeded())
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(disconnectP2PFailed())
  }
}

function* refreshIceServers(action) {
  // setup ice servers before going to setupP2PConnection
  try {
    const { authParams } = action.payload
    let variables = {}
    if (
      authParams &&
      authParams.type === SignalServerAuthenticationTypeEnum.ALERT
    ) {
      variables = {
        alertEventId: Number(authParams.alertEventId),
        alertEventHash: authParams.alertEventHash,
      }
    }
    const response = yield call(createQuery, GET_ICE_SERVERS, variables)
    const { getIceservers } = response.data
    yield put(
      refreshIceServersSucceeded({ iceServers: getIceservers, authParams }),
    )
  } catch (error) {
    const { message } = error
    yield put(createNotification({ message }))
    yield put(refreshIceServersFailed())
  }
}

function* fetchStreamSnapShot(action) {
  try {
    const { streamId, videoStreamKey } = action.payload
    const response = yield call(createQuery, GET_STREAM_SNAPSHOT, { streamId })
    yield put(
      fetchStreamSnapshotSucceeded({
        videoStreamKey,
        snapshot: get(response, 'data.getStream.snapshot.dataStr'),
      }),
    )
  } catch (error) {
    const { message } = error
    yield put(fetchStreamSnapshotFailed({ error: message }))
    yield put(createNotification({ message }))
  }
}

function* webrtcSaga() {
  yield takeLatest(setupP2PRequested, refreshIceServers)
  // After retrieving ICEServers setupP2PConnection
  yield takeEvery(refreshIceServersSucceeded, setupP2PConnection)
  yield takeEvery(sendP2PMessageRequested, sendP2PMessage)
  yield takeEvery(resetHangupRequested, resetHangup)
  yield takeLatest(disconnectP2PRequested, disconnectP2PConnection)
  yield takeLatest(resetConnectionRequested, resetConnection)
  yield takeEvery(fetchStreamSnapshotRequested, fetchStreamSnapShot)
  yield takeEvery(sendChannelMessageRequested, sendChannelMessage)
}

export default webrtcSaga
