import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import config from 'config'

// src
import {
  createNotification,
  NOTIFICATION_TYPES,
} from 'redux/slices/notifications'
import { SoundTypeEnum } from 'enums'
import getSocket from 'utils/getSocket'
import speakMessage from 'utils/speakMessage'
import LogoIcon from 'assets/logo_icon.png'

import { addAlert, wsConnect, wsStatus } from './verificationSlice'
import { FETCH_LIMIT, SOUND_LEVELS } from '../constants'

const socketHost = getSocket(
  config.verificationServer.HOST,
  config.verificationServer.PORT,
  config.verificationServer.SECURE,
  '/alerts',
)

const WEBSOCKET_HEARTBEAT_MSG = JSON.stringify({ id: null, type: 'ping' })
const WEBSOCKET_HEARTBEAT_INTERVAL = 30 * 1000
const WEBSOCKET_RECONNECT_TIMEOUT = 3 * 1000
const WEBSOCKET_MANUAL_CLOSE_CODE = 3005

const wsMiddleware = () => {
  let socket = null
  let heartbeatInterval = null

  const establishWebSocketConnect = store => {
    const state = store.getState()
    const idsSlug = state.verification.selectedSites.join('-')
    if (isEmpty(idsSlug)) return null
    return new WebSocket(`${socketHost}/${idsSlug}`)
  }

  const onOpen = (store, action) => open => {
    // Send a heartbeat message to keep WebSocket connection open
    heartbeatInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(WEBSOCKET_HEARTBEAT_MSG)
      }
    }, WEBSOCKET_HEARTBEAT_INTERVAL)

    store.dispatch(wsStatus({ isSocketConnected: true }))
    store.dispatch(
      createNotification({
        message: 'Connected to Ambient Servers',
        type: NOTIFICATION_TYPES.SUCCESS,
      }),
    )
  }

  const onMessage = store => event => {
    const alertInstance = JSON.parse(event.data)
    if (isUndefined(alertInstance.tsIdentifier)) return
    const state = store.getState()
    const { soundLevel, alertInstances } = state.verification

    if (soundLevel !== SOUND_LEVELS.OFF) {
      speakMessage({
        message:
          soundLevel === SOUND_LEVELS.HIGH
            ? `${alertInstance.alert.name} detected`
            : false,
        sound: SoundTypeEnum.NOTIFY,
      })
    }

    if (alertInstances.length === FETCH_LIMIT) {
      store.dispatch(
        createNotification({
          message:
            "The number of outstanding alerts has reached the maximum threshold we can display. We will resume displaying alerts when you've cleared the alerts outstanding. All new alerts can be still found in the History Panel.",
          type: NOTIFICATION_TYPES.INFO,
        }),
      )
    } else {
      store.dispatch(addAlert({ alertInstance }))
    }

    if ('Notification' in window) {
      const notify = () => {
        const notification = new Notification('Alert', {
          icon: LogoIcon,
          body: `${alertInstance.alert.name} detected`,
        })
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
        setTimeout(() => {
          notification.close()
        }, 5000)
      }
      if (Notification.permission === 'granted') {
        notify()
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') notify()
        })
      }
    }
  }

  const onClose = store => event => {
    clearInterval(heartbeatInterval)
    store.dispatch(wsStatus({ isSocketConnected: false }))

    if (event.code !== WEBSOCKET_MANUAL_CLOSE_CODE) {
      store.dispatch(
        createNotification({
          message: 'Disconnected from Ambient Servers. Retrying connection...',
          type: NOTIFICATION_TYPES.ERROR,
        }),
      )
      setTimeout(() => store.dispatch(wsConnect()), WEBSOCKET_RECONNECT_TIMEOUT)
    }
  }

  const onError = store => error => {
    store.dispatch(
      createNotification({
        message: `Connection encountered error: ${error.message}`,
        type: NOTIFICATION_TYPES.ERROR,
      }),
    )
    socket.close()
  }

  return store => next => action => {
    switch (action.type) {
      case wsConnect.type:
        // Close any existing socket connection before connecting
        if (!isNull(socket)) socket.close(WEBSOCKET_MANUAL_CLOSE_CODE)
        // Establish new connection
        socket = establishWebSocketConnect(store, action)
        if (!isNull(socket)) {
          socket.onopen = onOpen(store, action)
          socket.onmessage = onMessage(store, action)
          socket.onclose = onClose(store, action)
          socket.onerror = onError(store, action)
        }
        break
      default:
        return next(action)
    }
    return next(action)
  }
}

export default wsMiddleware()
