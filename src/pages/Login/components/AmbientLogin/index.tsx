import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import { Button, CircularProgress } from 'ambient_ui'
import Grid from '@material-ui/core/Grid'
import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

import {
  ReducerProps,
  updateForm,
  changeView,
  checkMfaRequested,
} from '../../redux/loginSlice'
import { VIEWS } from '../../enums'

import useStyles from './styles'

export default function AmbientLogin(): JSX.Element {
  const classes = useStyles({ isMobile })
  const dispatch = useDispatch()
  const form = useSelector((state: ReducerProps) => state.login.form)
  const loading = useSelector((state: ReducerProps) => state.login.loading)

  const handleLogin = () => dispatch(checkMfaRequested({}))
  const handleSSOLogin = () => dispatch(changeView({ view: VIEWS.SSO_LOGIN }))

  const handleKeyboard = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) handleLogin()
  }

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      updateForm({
        field,
        value: event.target.value,
      }),
    )
  }

  return (
    <div className={classes.loginForm}>
      <div className={classes.form}>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          autoComplete='email'
          autoFocus
          value={form.username}
          onChange={handleChange('username')}
        />
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          name='password'
          label='Password'
          type='password'
          id='password'
          autoComplete='current-password'
          value={form.password}
          onChange={handleChange('password')}
          onKeyUp={handleKeyboard}
        />
        <div className={classes.loginButton}>
          <Button
            data-cy='login'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.loginButtons}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={14} /> : 'Log in'}
          </Button>
        </div>
        <div className={classes.loginButton}>
          <Button
            fullWidth
            variant='contained'
            color='secondary'
            className={classes.loginButtons}
            onClick={handleSSOLogin}
            disabled={loading}
          >
            {loading && <CircularProgress size={14} />}
            {!loading && 'Continue with SSO Provider'}
          </Button>
        </div>
        <Grid container justify='center'>
          <Link to='/forgot-password' variant='body2' className={classes.link}>
            Forgot password
          </Link>
        </Grid>
      </div>
    </div>
  )
}
