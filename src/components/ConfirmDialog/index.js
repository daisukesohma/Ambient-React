import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Dialog, Grid, Typography } from '@material-ui/core'
import { Button, CircularProgress } from 'ambient_ui'

import useStyles from './styles'

const propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  confirmText: PropTypes.string,
  closeText: PropTypes.string,
}

const defaultProps = {
  content: '',
  loading: false,
  confirmText: 'Yes',
  closeText: 'No',
}

const ConfirmDialog = ({
  closeText,
  confirmText,
  content,
  loading,
  onClose,
  onConfirm,
  open,
}) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <Dialog onClose={onClose} open={open}>
      <Grid className={classes.gridRoot}>
        <Typography className={classes.confirmTitle}>{content}</Typography>
        <Grid className={classes.ConfirmBtnContainer}>
          <span className={classes.buttonLeft}>
            <Button onClick={onClose} variant='outlined'>
              {closeText}
            </Button>
          </span>
          <span>
            <Button disabled={loading} onClick={onConfirm}>
              {loading ? <CircularProgress /> : confirmText}
            </Button>
          </span>
        </Grid>
      </Grid>
    </Dialog>
  )
}

ConfirmDialog.propTypes = propTypes
ConfirmDialog.defaultProps = defaultProps

export default ConfirmDialog
