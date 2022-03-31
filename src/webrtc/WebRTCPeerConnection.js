import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import useInterval from '../common/hooks/useInterval'
import getNodeIds from '../selectors/webrtc/getNodeIds'
import {
  setupP2PRequested,
  disconnectP2PRequested,
  sendP2PMessageRequested,
} from '../redux/slices/webrtc'
import {
  SignalServerAuthenticationTypeEnum,
  StreamStateEnum,
  WebRTCMessageTypeEnum,
} from '../enums'

import mediaStreams from './mediaStreams'
import JWTService from '../common/services/JWTService'

const heartbeatIntervalMs = 30000 // 30s

const propTypes = {
  children: PropTypes.object,
}

const defaultProps = {
  children: {},
}

const WebRTCPeerConnection = ({ children }) => {
  const dispatch = useDispatch()
  const oldToken = useSelector(state => state.auth.token)
  const token = JWTService.migrateToken(oldToken)
  const nodeIds = useSelector(getNodeIds)
  // Starts the Peer connection and sends to middleware
  const { alertEventHash, alertEventId } = useParams()

  const heartbeatInterval = useInterval(() => {
    const aliveNodes = {}
    Object.keys(mediaStreams.streams).forEach(videoStreamKey => {
      const streamInfo = mediaStreams.streams[videoStreamKey]
      if (streamInfo && streamInfo.nodeId) {
        aliveNodes[streamInfo.nodeId] = true
      }
    })

    Object.keys(aliveNodes).forEach(nodeId => {
      dispatch(
        sendP2PMessageRequested({
          videoStreamKey: 'heartbeat',
          nodeId,
          data: {
            type: WebRTCMessageTypeEnum.IAMALIVE,
          },
        }),
      )
    })
  }, heartbeatIntervalMs)

  useEffect(() => {
    const authNodes = nodeIds || []

    let authParams = null
    if (token) {
      authParams = {
        type: SignalServerAuthenticationTypeEnum.BROWSER,
        token,
        nodeIds: authNodes,
      }

      dispatch(
        setupP2PRequested({
          authParams,
        }),
      )
    }
    return function cleanUp() {
      dispatch(
        disconnectP2PRequested({
          nodeIds: authNodes,
        }),
      )
    }
  }, [
    dispatch,
    heartbeatInterval,
    token,
    nodeIds,
    alertEventHash,
    alertEventId,
  ])

  return <>{children}</>
}

WebRTCPeerConnection.propTypes = propTypes
WebRTCPeerConnection.defaultProps = defaultProps

export default WebRTCPeerConnection
