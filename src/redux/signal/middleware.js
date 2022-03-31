import io from 'socket.io-client'
// src
import config from 'config'
import getSignalBridge from 'utils/getSignalBridge'
import { createNotification } from 'redux/slices/notifications'

import {
  WS_CONNECT,
  WS_DISCONNECT,
  WS_SEND_MSG,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from './actionTypes'

const ssMiddleware = () => {
  let socket = null
  // Map[sessionId -> callback]
  const subscribers = {}

  const createWebSocket = () => {
    return io(getSignalBridge(), {
      path: config.signalBridge.PATH,
      transports: ['websocket'],
    })
  }

  const onClose = (store, action) => event => {
    // If it closes, retry!
    store.dispatch(
      createNotification({
        message:
          'Disconnected from Ambient Streaming Service. Retrying connection...',
      }),
    )
    setTimeout(() => {
      socket = createWebSocket()
    }, 5000)
  }

  const onMessage = (store, rawMessage) => {
    const payload = JSON.parse(rawMessage)

    Object.keys(subscribers).forEach(key => {
      const callback = subscribers[key]
      if (callback) {
        callback(payload)
      }
    })
  }

  return store => next => action => {
    switch (action.type) {
      case WS_CONNECT:
        // Close any existing socket connection before connecting
        if (socket !== null) {
          socket.close()
        }
        // Create new connection
        socket = createWebSocket(action)
        socket.on('connect', () => {
          store.dispatch(
            createNotification({
              message: 'Connected to Ambient Streaming Service',
            }),
          )
          socket.on('areyoualive', data => {
            // Say i am alive
            socket.emit('iamalive', '')
          })
          socket.on('message', rawMessage => {
            onMessage(store, rawMessage)
          })
        })
        socket.on('disconnect', () => onClose(store, action))
        break
      case WS_DISCONNECT:
        if (socket !== null) {
          socket.close()
        }
        socket = null
        break
      case WS_SEND_MSG:
        if (socket !== null) {
          socket.send(JSON.stringify(action.data))
        }
        break
      case SUBSCRIBE:
        // Subscribe to signal server responses
        subscribers[action.data.key] = action.data.callback
        break
      case UNSUBSCRIBE:
        delete subscribers[action.data]
        break
      default:
        return next(action)
    }
    return next(action)
  }
}

export default ssMiddleware()
