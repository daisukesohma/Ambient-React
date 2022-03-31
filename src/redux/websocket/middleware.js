import React from 'react'
import get from 'lodash/get'
import find from 'lodash/find'
// src
import * as settingsActions from 'redux/slices/settings'
import * as feedActions from 'components/NewsFeed/feedSlice'
import * as activityLogActions from 'pages/ActivityLog/activityLogSlice'
import { showModal } from 'redux/slices/modal'
import { createNotification } from 'redux/slices/notifications'
import { ActivityTypeEnum, SoundTypeEnum, ModalTypeEnum } from 'enums'

import * as authActions from '../slices/auth'
import * as InvestigationActions from '../investigation/actions'
import * as InvestigationActionType from '../investigation/actionTypes'
import speakMessage from '../../utils/speakMessage'
import getSocket from '../../utils/getSocket'
import getAccountSlug from '../../utils/getAccountSlug'
import LogoIcon from '../../assets/logo_icon.png'
import RouterLink from '../../components/RouterLink'
import hasPermissionInState from '../../utils/hasPermissionInState'

import {
  ALERT,
  INVESTIGATION,
  MESSAGE,
  NODE_REQUEST_UPDATE,
  LOGOUT,
} from './webSocketMessageTypes'
import { WS_CONNECT, WS_DISCONNECT, WS_SEND_MSG } from './actionTypes'

const WEBSOCKET_HEARTBEAT_MSG = '--heartbeat--'
const WEBSOCKET_HEARTBEAT_INTERVAL = 30000

const socketHost = getSocket()

const wsMiddleware = () => {
  let socket = null
  let interval = null

  // eslint-disable-next-line consistent-return
  const createWebSocket = store => {
    const state = store.getState()
    const { auth } = state
    const accountSlug = getAccountSlug(state)

    if (accountSlug && auth.loggedIn) {
      const ws = new WebSocket(
        `${socketHost}/push/${accountSlug}/${auth.profile.id}`,
      )

      // Send a heartbeat message to keep WebSocket connection open
      interval = setInterval(() => {
        if (ws) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(WEBSOCKET_HEARTBEAT_MSG)
          } else if (ws.readyState === WebSocket.CLOSED) {
            clearInterval(interval)
          }
        }
      }, WEBSOCKET_HEARTBEAT_INTERVAL)

      store.dispatch(
        createNotification({
          message: 'Connected to Ambient Servers',
        }),
      )
      return ws
    }
  }

  const onMessage = store => event => {
    const { data } = event // ie. action.data
    const payload = JSON.parse(data)
    // eslint-disable-next-line no-console
    const state = store.getState()

    const profileId = get(state, 'auth.profile.id')

    const { speechIsMuted } = state.settings
    const { type } = payload
    const { is_escalated: isEscalated } = payload.data

    const accountSlug = getAccountSlug(state)

    switch (type) {
      case LOGOUT:
        store.dispatch(authActions.logoutRequested())
        window.location.reload()
        break
      case MESSAGE:
        if (get(payload, 'data.__typename')) {
          // Temporary solution to switch active security profile for active online users on DASHBOARD
          if (
            get(payload, 'data.__typename') ===
            ActivityTypeEnum.ProfileOverrideLogType
          ) {
            store.dispatch(
              settingsActions.setSecurityProfileName({
                name: get(payload, 'data.overridingSecurityProfile.name'),
              }),
            )
          }
          const activityPayload = {
            key: payload.data.__typename,
            activity: { ...payload.data, highlightDuration: 5000 },
          }
          store.dispatch(
            activityLogActions.createOrUpdateActivity(activityPayload),
          )
          store.dispatch(feedActions.createOrUpdateActivity(activityPayload))
        }
        break

      case ALERT:
        // check if the site slug is monitored or not
        if (
          get(state, 'operatorPage.unSelectedSites', []).findIndex(
            site => site.slug === payload.data.alert.site.slug,
          ) > -1 &&
          !find(payload.audience, profileId)
        ) {
          break
        }

        // Check if Hard Alert to show Hard Alert Modal
        if (!speechIsMuted) {
          speakMessage({
            message: `${payload.data.alert.name} detected`,
            sound: isEscalated ? SoundTypeEnum.NOTIFY : SoundTypeEnum.DING,
          })
        }

        if (
          isEscalated &&
          hasPermissionInState(state, {
            subject: 'Alerts',
            action: 'request_dispatch',
          })
        ) {
          store.dispatch(
            showModal({
              content: {
                alertEvent: {
                  ...payload.data,
                  eventHash: payload.data.event_hash,
                },
              },
              type: ModalTypeEnum.HIGH_ALERT,
            }),
          )
        }

        store.dispatch(settingsActions.setNewsFeedTabIndex({ index: 0 }))
        store.dispatch(
          feedActions.fetchAlertEventRequested({
            alertEventId: payload.data.id,
          }),
        )

        if ('Notification' in window) {
          const notify = () => {
            const notification = new Notification('Alert', {
              icon: LogoIcon,
              body: `${payload.data.alert.name} detected`,
            })
            notification.onclick = () => {
              window.focus()
              notification.close()
            }
            setTimeout(() => {
              notification.close()
            }, 5000)
          }
          const { permission } = Notification
          if (permission !== 'granted' && permission !== 'denied') {
            Notification.requestPermission().then(newPermission => {
              if (newPermission === 'granted') {
                notify()
              }
            })
          }
          if (permission === 'granted') {
            notify()
          }
        }
        // Add to Investigations Store
        break
      case INVESTIGATION:
        store.dispatch(
          InvestigationActions.setData({
            type: InvestigationActionType.SET_DATA,
            data: payload.data,
          }),
        )
        break
      case NODE_REQUEST_UPDATE:
        store.dispatch(
          createNotification({
            message: 'Stream Discovery Request is Completed',
            action: (
              <RouterLink to={`/accounts/${accountSlug}/infrastructure/jobs`}>
                See Jobs
              </RouterLink>
            ),
          }),
        )
        break
      default:
        break
    }
  }

  const onClose = (store, action) => event => {
    // If it closes, retry!
    store.dispatch(
      createNotification({
        message: 'Disconnected from Ambient Servers. Retrying connection...',
      }),
    )
    clearInterval(interval)
    setTimeout(() => {
      socket = createWebSocket(store)
    }, 5000)
  }

  return store => next => action => {
    switch (action.type) {
      case authActions.logoutRequested.type:
        if (socket) socket.close()
        break
      case WS_CONNECT:
        // Close any existing socket connection before connecting
        if (socket) socket.close()
        // Create new connection
        socket = createWebSocket(store, action)
        if (socket) {
          socket.onmessage = onMessage(store)
          socket.onclose = onClose(store, action)
        }
        break
      case WS_DISCONNECT:
        if (socket) {
          socket.close()
          clearInterval(interval)
        }
        socket = null
        break
      case WS_SEND_MSG:
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(action.data.msg))
        }
        break
      default:
        return next(action)
    }
    return next(action)
  }
}

export default wsMiddleware()
