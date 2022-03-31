import React, { useEffect } from 'react'
// src
import Notifications from 'components/Notifications'
import NewVersionSnackbar from 'components/organisms/NewVersionSnackbar'
import AlertSnackbar from 'components/organisms/AlertSnackbar'
import NetworkDetectorSnackbar from 'components/organisms/NetworkDetectorSnackbar'
import useUpdateAbilities from 'common/hooks/useUpdateAbilities'

import useStyles from './styles'

interface Props {
  children: JSX.Element
}

// NOTE: In this Layout you can add only global hooks.
// It means that this actions will be fired on
// ANY router of application with ANY sub-layout

export default function ApplicationLayout({ children }: Props): JSX.Element {
  const classes = useStyles()
  // NOTE: sync RBAC permissions
  useUpdateAbilities()

  // NOTE: ask client about HTML5 Native Notifications
  useEffect(() => {
    if (!('Notification' in window)) return
    const { permission } = Notification
    if (permission !== 'granted' && permission !== 'denied') {
      Notification.requestPermission()
    }
  }, [])

  const isLocal = window.location.hostname === 'localhost'

  return (
    <div className={classes.maximized}>
      {children}
      <Notifications />
      <NetworkDetectorSnackbar />
      {!isLocal && <NewVersionSnackbar />}
      <AlertSnackbar />
    </div>
  )
}
