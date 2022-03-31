import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import { makeStyles } from '@material-ui/core/styles'
import MuiAlert from '@material-ui/lab/Alert'

// src
import {
  removeNotification,
  NOTIFICATION_TYPES,
} from 'redux/slices/notifications'

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const useStyles = makeStyles(({ palette }) => ({
  alert: ({ type }) => {
    const NOTIFICATION_COLOR_MAP = {
      [NOTIFICATION_TYPES.ERROR]: palette.error.main,
      [NOTIFICATION_TYPES.WARNING]: palette.warning.main,
      [NOTIFICATION_TYPES.INFO]: palette.primary.main,
      [NOTIFICATION_TYPES.SUCCESS]: palette.common.greenBluePastel,
    }
    return {
      backgroundColor: NOTIFICATION_COLOR_MAP[type],
    }
  },
}))

function Notifications() {
  const dispatch = useDispatch()
  const duration = useSelector(state => state.notifications.duration)
  const isVisible = useSelector(state => state.notifications.isVisible)
  const message = useSelector(state => state.notifications.message)
  const action = useSelector(state => state.notifications.action)
  const type = useSelector(state => state.notifications.type)
  const classes = useStyles({ type })

  const handleClose = () => {
    dispatch(removeNotification())
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={isVisible}
      autoHideDuration={duration}
      onClose={handleClose}
      action={action}
    >
      <Alert className={classes.alert} severity={type} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default Notifications
