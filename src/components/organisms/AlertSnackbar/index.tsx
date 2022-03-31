import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isNil } from 'lodash'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline'
// src
import { toggleCancelModal } from 'features/SecurityPosturePanel/securityPosturePanelSlice'

import useStyles from './styles'
import {
  closeAlertSnackbar,
  AlertSnackbarSliceProps,
} from './redux/alertSnackbarSlice'

export default function AlertSnackbar(): JSX.Element {
  const dispatch = useDispatch()
  const classes = useStyles()
  const snackbarOpen = useSelector(
    (state: AlertSnackbarSliceProps) => state.alertSnackbar.snackbarOpen,
  )

  const message = useSelector(
    (state: AlertSnackbarSliceProps) => state.alertSnackbar.message,
  )

  const threatSignaturePausePeriodId = useSelector(
    (state: AlertSnackbarSliceProps) =>
      state.alertSnackbar.threatSignaturePausePeriodId,
  )

  const handleClose = (): void => {
    dispatch(closeAlertSnackbar())
  }

  const handleUndo = (): void => {
    dispatch(toggleCancelModal({ id: threatSignaturePausePeriodId }))
    handleClose()
  }

  /* TODO(AMB-2276|@rys): make this reuseable. Alert snackbar doesn't have undo for event not suspicious. */
  const action = (
    <div className={classes.actions}>
      {/** TODO(AMB-2276|@rys): we shouldn't do this. once this component is reusable, create new snackbar for pause alert and successful alert
       * feedback submission.
       */}
      {isNil(threatSignaturePausePeriodId) ? null : (
        <Button
          color='default'
          size='small'
          onClick={handleUndo}
          className={classes.undo}
        >
          Undo
        </Button>
      )}

      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </div>
  )

  const fullMessage = (
    <div className={classes.root}>
      <>
        <div className={classes.icon}>
          <CheckCircleOutline />
        </div>
        {message}
      </>
      {action}
    </div>
  )

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        action={action}
      >
        {fullMessage}
      </Snackbar>
    </div>
  )
}
