import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import get from 'lodash/get'
// src
import { Button } from 'ambient_ui'
import { hideModal, confirm } from 'redux/slices/modal'

import useStyles from './styles'

export default function Confirm() {
  const text = useSelector(state =>
    get(state.modal, 'data.text', 'Are you sure?'),
  )
  const html = useSelector(state => get(state.modal, 'data.html'))
  const dispatch = useDispatch()
  const classes = useStyles()

  const onNoClick = () => {
    dispatch(hideModal())
  }

  const onYesClick = () => {
    dispatch(confirm())
  }

  let Html = null
  if (html) Html = html

  return (
    <>
      {html ? (
        <div className={classes.title}>
          <Html />
        </div>
      ) : (
        <Typography className={classes.title} variant='h5'>
          {text}
        </Typography>
      )}
      <Grid className={classes.btnContainer}>
        <Button
          onClick={onNoClick}
          variant='outlined'
          style={{ marginRight: 8 }}
        >
          No
        </Button>
        <Button onClick={onYesClick}>Yes</Button>
      </Grid>
    </>
  )
}
