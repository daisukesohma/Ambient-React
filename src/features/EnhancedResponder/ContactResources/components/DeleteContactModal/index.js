import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
// import { Typography, Grid, Input } from '@material-ui/core'
import { Button } from 'ambient_ui'
// src

import {
  deleteContactRequested,
  closeDeleteModal,
} from '../../contactResourcesSlice'

import useStyles from './styles'

const DeleteContactModal = () => {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const contactToDelete = useSelector(
    state => state.contactResources.contactToDelete,
  )

  const isLoading = useSelector(
    state => state.contactResources.deleteContactLoading,
  )

  const handleClose = () => {
    dispatch(closeDeleteModal())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const handleDeleteContact = useCallback(
    input => {
      dispatch(deleteContactRequested({ input }))
    },
    [dispatch],
  )

  const onYesClick = () => {
    const input = {
      id: contactToDelete.id,
    }
    handleDeleteContact(input)
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Delete Contact
      </Typography>
      <Grid container>
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>
            Delete this contact?
          </Typography>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>
            {`Name: ${contactToDelete.name}`}
          </Typography>
        </Grid>
        {contactToDelete.site && (
          <Grid className={classes.inputRow}>
            <Typography className={classes.label}>
              {`Site: ${contactToDelete.site.name}`}
            </Typography>
          </Grid>
        )}
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>
            {`Type: ${contactToDelete.type}`}
          </Typography>
        </Grid>
        <Grid className={classes.inputRow}>
          <Typography className={classes.label}>
            {`Details: ${contactToDelete.details}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid className={classes.btnContainer}>
        <Button
          onClick={onClickCancel}
          variant='outlined'
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>
        <Button onClick={onYesClick} disabled={isLoading} loading={isLoading}>
          Confirm
        </Button>
      </Grid>
    </div>
  )
}

export default React.forwardRef((props, ref) => (
  <DeleteContactModal {...props} ref={ref} />
))
