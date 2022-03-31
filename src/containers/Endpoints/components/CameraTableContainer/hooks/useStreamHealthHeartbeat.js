import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
// src
import { createNotification } from 'redux/slices/notifications'
import { getSocket } from 'utils'
import config from 'config'
import selectedSiteOption from 'selectors/cameras/selectedSiteOption'
import useInterval from 'common/hooks/useInterval'
import { setStreamHealth, setStreamsHealthLoading } from 'redux/cameras/actions'

import useAllStreamIdsPerSite from './useAllStreamIdsPerSite'
// import mockHealth from './mockHealth'

// How often to ping the websocket requesting stream data?
const WEBSOCKET_PING_INTERVAL_MS = 30000

// Websocket Config
const CONNECTION_STATUS_CONNECTING = 0
const CONNECTION_STATUS_OPEN = 1
const CONNECTION_STATUS_CLOSING = 2
const CONNECTION_STATUS_CLOSED = 3

const useStreamHealthHeartbeat = () => {
  const dispatch = useDispatch()
  const { account } = useParams()
  const selectedSite = useSelector(selectedSiteOption)
  const streamsHealthIds = useSelector(state => state.cameras.streamsHealthIds)
  const streamsHealthLoading = useSelector(
    state => state.cameras.streamsHealthLoading,
  )
  const [didGetStreamIds] = useAllStreamIdsPerSite() //eslint-disable-line

  const root = getSocket(config.socket.HOST, config.socket.PORT, false)
  const url = `${root}/device_monitor/${account}`
  const [sendMessage, lastMessage, readyState] = useWebSocket(url)
  const [isWSConnected, setIsWSConnected] = useState(true) //eslint-disable-line
  // ie. is editing? do we want to be connected to websocket or not
  //
  const wsConnectionStatus = {
    [CONNECTION_STATUS_CONNECTING]: 'Connecting',
    [CONNECTION_STATUS_OPEN]: 'Open',
    [CONNECTION_STATUS_CLOSING]: 'Closing',
    [CONNECTION_STATUS_CLOSED]: 'Closed',
  }[readyState]

  const [latestHealthStatus, setLatestHealthStatus] = useState(null) // TO put in REDUCER state.cameras.streamsHealth

  // Ensures fast response on pageload with smart interval management
  // FUTURE: @Rodaan could integrate exponential backoff here, but probably want to ping regularly
  // Also, will have to revisit logic here if we convert to one websocket
  const switchPingInterval = (wsConnected, wsReadyState) => {
    let interval
    if (wsConnected && !latestHealthStatus) {
      // if websocket health status data hasn't arrived yet, ping every 1s
      interval = 1000
    } else if (wsConnected && latestHealthStatus) {
      // else, make ping every 25s
      interval = WEBSOCKET_PING_INTERVAL_MS
    } else if (!wsConnected) {
      // and turn off websocket if it's disconnected
      interval = null
    }
    return interval
  }

  // 6) IF WS IS OPEN, POLLING INTERVAL FOR STREAM HEALTH
  // Sends message with setInterval-like hook
  // isWSConnected will pause the websocket. Useful for editing-state of the material-table,
  // Else the table goes into an uneditable state when props change.
  //
  const requestStreamData = useCallback(() => {
    // Ensure message will be constructed properly
    // if you don't have streamIds, sending message to websocket will
    // close the websocket (silent error, spent hours debugging)
    //
    if (get(selectedSite, 'id') && streamsHealthIds) {
      const msg = {
        site_id: selectedSite.id,
        streams: streamsHealthIds,
      }
      sendMessage(JSON.stringify(msg))
      dispatch(setStreamsHealthLoading(true))
    }
  }, [streamsHealthIds, selectedSite, dispatch, sendMessage])

  const requestStreamDataIfReady = useCallback(() => {
    if (readyState === 1) {
      requestStreamData()
    }
  }, [requestStreamData, readyState])

  useInterval(() => {
    requestStreamDataIfReady()
  }, switchPingInterval(isWSConnected, readyState))

  // Re-ping every time health ids change (usually when site changes)
  useEffect(() => {
    requestStreamDataIfReady()
  }, [streamsHealthIds, requestStreamDataIfReady])

  // Parse Websocket Packet
  // NOTE: If Websocket IS NOT currently being used 2/16/2021
  // We can probably safely remove this
  useEffect(() => {
    if (lastMessage !== null) {
      const packet = JSON.parse(lastMessage.data)
      if (packet.type === 'init') {
        dispatch(createNotification({ message: 'Connected to servers' }))
      } else if (packet.type === 'packet' && packet.data) {
        dispatch(setStreamsHealthLoading(false))
        setLatestHealthStatus({ ...latestHealthStatus, ...packet.data })
        dispatch(setStreamHealth(packet.data))
      }
    }
  }, [lastMessage, dispatch]) //eslint-disable-line

  // MOCKING DATA - REMOVE WHEN WEBSOCKET WORKS
  // useEffect(() => {
  //   if (!latestHealthStatus) {
  //     setLatestHealthStatus(mockHealth)
  //     dispatch(setStreamHealth(mockHealth))
  //   }
  // }, [latestHealthStatus])

  return {
    status: wsConnectionStatus,
    isLoading: streamsHealthLoading,
    refetchData: requestStreamDataIfReady,
  }
}

export default useStreamHealthHeartbeat
