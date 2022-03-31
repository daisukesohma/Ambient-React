import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

// This is a first pass at a potential Ambient_UI alert dialog box that is reusable.
// There's a lot more that can be done for customization
// Could implement where you can pass in children render for whole Content or Actions sections
// or actionButtons as a prop
function AlertDialog(props) {
  const { acceptClick, acceptText, handleClose, open, title, content } = props
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={acceptClick} color="primary" autoFocus>
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

AlertDialog.defaultProps = {
  acceptClick: () => {},
  acceptText: 'Accept',
  handleClose: () => {},
  open: false,
  title: 'Alert',
  content: 'Alerting',
}

AlertDialog.propTypes = {
  acceptClick: PropTypes.func,
  acceptText: PropTypes.string,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
}

export default AlertDialog
