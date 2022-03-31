import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Grid, Input } from '@material-ui/core'
import { Button, CircularProgress } from 'ambient_ui'
// src

import {
  closeCreateModal,
  createContactRequested,
} from '../../externalContactsSlice'

import useStyles from './styles'

const CreateExternalProfileModal = () => {
  const { account } = useParams()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const loading = useSelector(
    state => state.externalContacts.createContactLoading,
  )
  const classes = useStyles({ darkMode })
  const [name, setName] = useState(null)
  const [email, setEmail] = useState(null)
  const [phone, setPhone] = useState(null)

  const handleClose = () => {
    dispatch(closeCreateModal())
  }

  const onClickCancel = () => {
    handleClose()
  }

  const onYesClick = () => {
    const data = {
      accountSlug: account,
      name,
      email,
      phoneNumber: phone,
    }
    dispatch(createContactRequested({ input: data }))
  }

  const nameChange = e => {
    if (e.target.value.length > 0) {
      setName(e.target.value)
    } else {
      setName(null)
    }
  }

  const emailChange = e => {
    if (e.target.value.length > 0) {
      setEmail(e.target.value)
    } else {
      setEmail(null)
    }
  }

  const phoneChange = e => {
    if (e.target.value.length > 0) {
      setPhone(e.target.value)
    } else {
      setPhone(null)
    }
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Create External Contact
      </Typography>
      <Grid container>
        <Grid item className={classes.inputRow}>
          <Typography className={classes.label}>Name:</Typography>
          <Input
            classes={{
              root: classes.input,
              inputProps: classes.input,
              InputProps: classes.input,
            }}
            placeholder='Name'
            onChange={nameChange}
          />
        </Grid>
        <Grid item className={classes.inputRow}>
          <Typography className={classes.label}>Email</Typography>
          <Input
            classes={{
              root: classes.input,
              inputProps: classes.input,
              InputProps: classes.input,
            }}
            placeholder='Email'
            onChange={emailChange}
          />
        </Grid>
        <Grid item className={classes.inputRow}>
          <Typography className={classes.label}>Phone Number</Typography>
          <div className={classes.inputContainer}>
            <Input
              classes={{
                root: classes.input,
                inputProps: classes.input,
                InputProps: classes.input,
              }}
              placeholder='Phone Number'
              onChange={phoneChange}
            />
          </div>
        </Grid>
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
        <Button disabled={!(name && (email || phone))} onClick={onYesClick}>
          Confirm
        </Button>
      </Grid>
    </div>
  )
}

export default CreateExternalProfileModal
