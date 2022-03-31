import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Button } from 'ambient_ui'
import { useSelector } from 'react-redux'

import useStyles from './styles'

const Buttons = ({
  setOpenRollbackDialog,
  isRollbackInProgress,
  isUpdateInProgress,
  isDirty,
  handleSave,
  openRollbackDialog,
  handleRollback,
}) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  return (
    <Grid item lg={6} md={6} sm={12} xs={12} className={classes.btnContainer}>
      <Button
        color='primary'
        variant='contained'
        size='medium'
        aria-label='save'
        disabled={!isDirty || isUpdateInProgress}
        onClick={handleSave}
        className={classes.saveBtn}
      >
        <span style={{ marginLeft: '4px' }}>Save</span>
      </Button>
      <Dialog
        open={openRollbackDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        classes={{
          root: classes.dialogRoot,
          paper: classes.dialogPaper,
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          classes={{ root: classes.dialogTitle }}
        >
          <div className='am-h6'>Switch to Classic Ambient?</div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            classes={{ root: classes.dialogContentText }}
          >
            For awhile, our old design at Ambient will be available to switch
            back to. We are continuing to improve the new Ambient interface
            every day. If you are facing critical issues, please let us know at{' '}
            <a href='mailto:support@ambient.ai'>support@ambient.ai</a>
          </DialogContentText>
        </DialogContent>
        <DialogActions classes={{ root: classes.dialogActionsRoot }}>
          <Button
            onClick={() => handleRollback()}
            variant='outlined'
            className={classes.rollbackConfirm}
          >
            Yes, Classic Ambient
          </Button>
          <Button
            variant='contained'
            onClick={() => setOpenRollbackDialog(false)}
            autoFocus
          >
            No, New Ambient
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

Buttons.defaultProps = {
  setOpenRollbackDialog: () => {},
  isRollbackInProgress: false,
  isUpdateInProgress: false,
  isDirty: false,
  handleSave: () => {},
  openRollbackDialog: false,
  handleRollback: () => {},
}

Buttons.propTypes = {
  setOpenRollbackDialog: PropTypes.func,
  isRollbackInProgress: PropTypes.bool,
  isUpdateInProgress: PropTypes.bool,
  isDirty: PropTypes.bool,
  handleSave: PropTypes.func,
  openRollbackDialog: PropTypes.bool,
  handleRollback: PropTypes.func,
}

export default Buttons
