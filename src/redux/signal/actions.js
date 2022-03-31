import {
  WS_CONNECT,
  WS_DISCONNECT,
  WS_SEND_MSG,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from './actionTypes'

export const wsConnect = ({ host }) => ({ type: WS_CONNECT, data: { host } })
export const wsDisconnect = () => ({ type: WS_DISCONNECT })

export const subscribe = (key, callback) => ({
  type: SUBSCRIBE,
  data: {
    key,
    callback,
  },
})

export const unsubscribe = key => ({
  type: UNSUBSCRIBE,
  data: key,
})

export const requestIceServers = ({ nodeId, sessionId, peerConnId }) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'iceservers',
    nodeId,
    sessionId,
    uniqId: peerConnId,
    peerConnId,
    data: {},
  },
})

export const requestCandidates = ({
  nodeId,
  viewmode,
  sessionId,
  peerConnId,
  streamId,
}) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'getcandidate',
    nodeId,
    viewmode,
    sessionId,
    uniqId: peerConnId,
    peerConnId,
    streamId,
    data: {},
  },
})

export const sendCandidate = ({
  nodeId,
  sessionId,
  peerConnId,
  streamId,
  candidate,
}) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'candidate',
    nodeId,
    sessionId,
    uniqId: peerConnId,
    peerConnId,
    streamId,
    data: {
      candidate: JSON.stringify(candidate),
    },
  },
})

export const sendOffer = ({
  nodeId,
  viewmode,
  sessionId,
  peerConnId,
  streamId,
  sessionDescription,
}) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'offer',
    nodeId,
    viewmode,
    sessionId,
    uniqId: peerConnId,
    peerConnId,
    streamId,
    data: {
      offer: sessionDescription,
    },
  },
})

export const hangup = ({ nodeId, sessionId, peerConnId, streamId }) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'hangup',
    nodeId,
    sessionId,
    uniqId: peerConnId,
    peerConnId,
    streamId,
    data: {},
  },
})

export const sendExportRequest = ({
  nodeId,
  sessionId,
  uniqId,
  streamId,
  startTs,
  endTs,
}) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'export',
    streamId,
    nodeId,
    // TODO: DOS possibility. Machine Perception Team wanted exported videos to contain stream id and the start and end time stamps.
    // Math.floor is needed because video exports URL does not take in decimal so must be a round number
    uniqId,
    sessionId,
    data: {
      start_ts: startTs,
      end_ts: endTs,
      // Unused in appliance right now
      s3: 'UNUSED. CHANGE',
    },
  },
})

export const updateArchivalPlayTime = ({
  nodeId,
  sessionId,
  uniqId,
  streamId,
  ts,
}) => ({
  type: WS_SEND_MSG,
  data: {
    src: 'browser',
    meantfor: 'node',
    type: 'archival',
    streamId,
    uniqId,
    nodeId,
    sessionId,
    data: {
      command: 'ts',
      ts,
    },
  },
})
