import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Typography, Grid } from '@material-ui/core'
// import { Typography, Grid, Input } from '@material-ui/core'
import { Button } from 'ambient_ui'

import {
  cancelThreatSignaturePausePeriodRequested,
  toggleCancelModal,
} from '../../securityPosturePanelSlice'

import useStyles from './styles'

const CancelPauseModalLayout = () => {
  const { account } = useParams()
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const [description, setDescription] = useState(null)
  const pausePeriodToDelete = useSelector(
    state => state.securityPosturePanel.pausePeriodToDelete,
  )

  const handleCancelPause = useCallback(
    input => {
      dispatch(cancelThreatSignaturePausePeriodRequested(input))
    },
    [dispatch],
  )

  const onYesClick = () => {
    const input = {
      threatSignaturePausePeriodId: pausePeriodToDelete,
      accountSlug: account,
      cancelledDescription: description,
    }
    handleCancelPause(input)
    handleClose()
  }

  const handleClose = () => {
    dispatch(toggleCancelModal({ id: null }))
  }

  const onClickCancel = () => {
    handleClose()
  }

  const onDescriptionChange = e => {
    if (e.target.value === '') {
      setDescription(null)
    } else {
      setDescription(e.target.value)
    }
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant='h4'>
        Reenable Threat Signature
      </Typography>
      <Grid container>
        <Typography className={classes.title} variant='h6'>
          Why do you want to reenable this threat signature early?
        </Typography>
        <Grid item className={classes.textFieldGrid}>
          <TextField
            placeholder='Description'
            type='string'
            onChange={onDescriptionChange}
            className={classes.textField}
            inputProps={{
              className: classes.textFieldInput,
            }}
            InputProps={{
              className: classes.textFieldInput,
            }}
            variant='outlined'
          />
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
        <Button onClick={onYesClick}>Confirm</Button>
      </Grid>
    </div>
  )
}

export default CancelPauseModalLayout
