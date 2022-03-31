import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CircularProgress } from 'ambient_ui'
import { isMobile } from 'react-device-detect'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'

import {
  ReducerProps,
  changeView,
  tokenAuthRequested,
  updateForm,
} from '../../redux/loginSlice'
import { VIEWS } from '../../enums'

import useStyles from './styles'

export default function TwoFactorConfirm(): JSX.Element {
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles({ isMobile })
  const code = useSelector((state: ReducerProps) => state.login.form.code)
  const loading = useSelector((state: ReducerProps) => state.login.loading)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateForm({
        field: 'code',
        value: event.target.value,
      }),
    )
  }

  const handleSubmit = () =>
    dispatch(
      tokenAuthRequested({
        onSuccess: ({ accounts }: { accounts: [] }) => {
          if (accounts.length > 1) history.push(`/select-account`)
        },
      }),
    )
  const handleBack = () => dispatch(changeView({ view: VIEWS.LOGIN }))

  const handleKeyboard = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) handleSubmit()
  }

  return (
    <div className={classes.paper}>
      <div className={classes.form}>
        <div>
          Enter the code that was sent to your device to complete sign in.
        </div>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          label='Confirmation Code'
          name='confirmCode'
          autoFocus
          value={code}
          onChange={onChange}
          onKeyUp={handleKeyboard}
        />

        <Button
          fullWidth
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={14} /> : 'Confirm Code'}
        </Button>
        <Grid container justify='space-around'>
          <Link
            to='/'
            variant='body2'
            className={classes.link}
            onClick={handleBack}
          >
            Back
          </Link>
        </Grid>
      </div>
    </div>
  )
}
