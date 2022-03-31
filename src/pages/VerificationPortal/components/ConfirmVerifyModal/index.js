import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'ambient_ui'
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

import {
  setOpenConfirmVerifyModal,
  verifyAlertRequested,
} from '../../redux/verificationSlice'

import AlertInstanceView from './AlertInstanceView'
import useStyles from './styles'
import { AlertInstanceAction } from '../../constants'

export default function ConfirmVerifyModal() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const alertInstance = useSelector(
    state => state.verification.confirmVerifyAlertInstance,
  )
  const isConfirmVerifyModalOpen = useSelector(
    state => state.verification.isConfirmVerifyModalOpen,
  )

  const handleClose = () =>
    dispatch(setOpenConfirmVerifyModal({ isConfirmVerifyModalOpen: false }))

  const verify = () => {
    dispatch(
      verifyAlertRequested({
        alertInstanceId: alertInstance.id,
        alertHash: alertInstance.alertHash,
        status: AlertInstanceAction.VERIFY,
      }),
    )
    handleClose()
  }

  return (
    <div>
      <Dialog
        disableEnforceFocus
        fullWidth={true}
        maxWidth={'md'}
        open={isConfirmVerifyModalOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle>
          <Typography className='am-h5'>Verify Alert?</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText classes={{ root: 'am-body1' }}>
            This Alert will be possibly reviewed and sent to the customer. Are
            you sure you want to verify this?
          </DialogContentText>
          <AlertInstanceView alertInstance={alertInstance} />
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActionsRoot }}>
          <Button variant='outlined' onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={verify}
            color='primary'
            autoFocus
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
