import React from 'react'
// import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid } from '@material-ui/core'
import { Button, CircularProgress } from 'ambient_ui'
// src

import {
  closeDeleteModal,
  deleteContactRequested,
} from '../../externalContactsSlice'

import useStyles from './styles'

const CreateExternalProfileModal = () => {
  // const { account } = useParams()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const loading = useSelector(
    state => state.externalContacts.deleteContactLoading,
  )
  const contact = useSelector(state => state.externalContacts.contact)
  const classes = useStyles({ darkMode })

  const handleClose = () => {
    dispatch(closeDeleteModal())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const onYesClick = () => {
    const data = {
      id: contact.id,
    }
    dispatch(deleteContactRequested({ input: data }))
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Delete External Contact
      </Typography>
      <Grid container>
        <Grid item className={classes.inputRow}>
          <Typography className={classes.label}>
            Are you sure you want to delete:{' '}
          </Typography>
        </Grid>
        <Grid item className={classes.inputRow}>
          <Typography className={classes.label}>{contact.name}</Typography>
        </Grid>
        {contact.email && (
          <Grid item className={classes.inputRow}>
            <Typography className={classes.label}>
              {`Email: ${contact.email}`}
            </Typography>
          </Grid>
        )}
        {contact.phoneNumber && (
          <Grid item className={classes.inputRow}>
            <Typography className={classes.label}>
              {`Phone Number: ${contact.phoneNumber}`}
            </Typography>
          </Grid>
        )}
      </Grid>
      <Grid className={classes.btnContainer}>
        {loading && (
          <div className={classes.progress}>
            <CircularProgress size={30} />
          </div>
        )}
        <Button
          onClick={onClickCancel}
          variant='outlined'
          style={{ marginRight: 8 }}
        >
          Cancel
        </Button>
        <Button disabled={false} onClick={onYesClick}>
          Confirm
        </Button>
      </Grid>
    </div>
  )
}

export default CreateExternalProfileModal
