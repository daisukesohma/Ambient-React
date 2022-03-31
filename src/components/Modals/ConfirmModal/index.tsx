import React from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
// src
import { Button } from 'ambient_ui'

import BaseModalWrapper from '../Wrappers/BaseModalWrapper'

import useStyles from './styles'

interface Props {
  open: boolean
  children?: React.ReactNode
  onClose: () => void
  onConfirm: () => void
  text?: string
}

const defaultProps = {
  children: undefined,
  text: 'Are you sure?',
}

function ConfirmModal({
  open = false,
  onClose = () => {},
  children = undefined,
  onConfirm = () => {},
  text = 'Are you sure?',
}: Props): JSX.Element {
  const classes = useStyles()

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <BaseModalWrapper withDarkMode={false}>
        {children ? (
          <div className={classes.title}>{children}</div>
        ) : (
          <Typography className={classes.title} variant='h5'>
            {text}
          </Typography>
        )}
        <Grid className={classes.btnContainer}>
          <Button
            onClick={onClose}
            variant='outlined'
            style={{ marginRight: 8 }}
          >
            No
          </Button>
          <Button onClick={onConfirm}>Yes</Button>
        </Grid>
      </BaseModalWrapper>
    </Modal>
  )
}

ConfirmModal.defaultProps = defaultProps

export default ConfirmModal
