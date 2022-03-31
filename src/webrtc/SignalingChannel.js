// Copyright (C) <2018> Intel Corporation
//
// SPDX-License-Identifier: Apache-2.0

import io from 'socket.io-client'
import { store } from 'redux/store'
import { setupP2PSucceeded } from 'redux/slices/webrtc'
import { WebRTCMessageTypeEnum } from 'enums'

/**
 * @class SignalingChannel -- TODO: Use the existing wsSignal socket connection
 * @classDesc Signaling module for Open WebRTC Toolkit P2P chat
 */
function SignalingChannel() {
  this.onMessage = null
  this.onServerDisconnected = null

  let wsServer = null

  const self = this
  let p2pId = null
  let connectPromise = null

  /* TODO: Do remember to trigger onMessage when new message is received.
     if(this.onMessage)
       this.onMessage(from, message);
   */

  // message should a string.
  // this.send = function(targetId, message) {
  //   const data = {
  //     data: message,
  //     to: targetId,
  //   }
  //   return new Promise((resolve, reject) => {
  //     wsServer.emit('message', data, function(err) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve()
  //       }
  //     })
  //   })
  // }

  this.send = function(targetId, message) {
    return new Promise((resolve, reject) => {
      wsServer.emit('message', message, targetId, function(err) {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  this.connect = function(authObject) {
    let serverAddress = authObject.host
    // Query dict is converted to URL by Socket.IO
    const opts = {
      query: {},
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 10000,
      rememberUpgrade: true,
    }
    if (authObject.authParams) {
      if (authObject.authParams.type === 'browser') {
        const { token } = authObject.authParams
        if (token) {
          opts.query.token = encodeURIComponent(token)
          opts.query.type = 'browser'
          if (authObject.authParams.prevId) {
            opts.query.prevId = authObject.authParams.prevId
          }
          opts.secure = true
          opts.transports = ['websocket', 'polling']
          opts.rejectUnauthorized = false
        }
      } else if (authObject.authParams.type === 'alert') {
        const { alertEventId, alertEventHash } = authObject.authParams
        opts.query.type = 'alert'
        opts.query.alert_id = alertEventId
        opts.query.token = alertEventHash
        if (authObject.authParams.prevId) {
          opts.query.prevId = authObject.authParams.prevId
        }
        opts.secure = true
        opts.transports = ['websocket', 'polling']
        opts.rejectUnauthorized = false
      }
    }
    if (wsServer) {
      wsServer.close()
    }
    wsServer = io(serverAddress, opts)

    wsServer.on('connect', function(e) {
      console.info('Connected to websocket server.')
    })

    wsServer.on('server-authenticated', function(data) {
      p2pId = decodeURI(data.uid)
      console.log(`Authentication passed. User ID: ${p2pId}`)
      wsServer.io.engine.query.prevId = p2pId
      store.dispatch(setupP2PSucceeded({ p2pId }))
      if (connectPromise) {
        connectPromise.resolve(p2pId)
      }
      connectPromise = null
    })

    wsServer.on('reconnect_attempt', function(num) {
      if (p2pId) {
        wsServer.io.engine.query.prevId = p2pId
      }
    })

    wsServer.on('reconnect_failed', function() {
      console.log(`Reconnect failed`)
      //      if (self.onServerDisconnected) {
      //        self.onServerDisconnected()
      //      }
    })

    wsServer.on('server-disconnect', function() {})

    wsServer.on('disconnect', function() {
      console.info('Disconnected from websocket server.')
      //      if (self.onClientDisconnected) {
      //        self.onClientDisconnected()
      //      }
    })

    wsServer.on('connect_failed', function(errorCode) {
      console.error(`Connect to websocket server failed, error:${errorCode}.`)
      if (connectPromise) {
        connectPromise.reject(parseInt(errorCode))
      }
      connectPromise = null
    })

    wsServer.on('error', function(err) {
      console.error(`Socket.IO error:${err}`)
      if (err === '2103' && connectPromise) {
        connectPromise.reject(err)
        connectPromise = null
      }
    })

    wsServer.on('message', function(message, origin) {
      const data = JSON.parse(message)
      if (
        data.type === WebRTCMessageTypeEnum.NEW_TRACK_ID ||
        data.type === WebRTCMessageTypeEnum.ERROR ||
        data.type === WebRTCMessageTypeEnum.SYNC
      ) {
        self.onMessageNext(data, origin)
      } else if (self.onMessage) {
        self.onMessage(data, origin)
      }
    })

    return new Promise((resolve, reject) => {
      connectPromise = {
        resolve,
        reject,
      }
    })
  }

  this.disconnect = function() {
    if (wsServer) {
      wsServer.close()
    }
    return Promise.resolve()
  }
}

export default SignalingChannel
