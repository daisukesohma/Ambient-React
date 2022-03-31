import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory, useParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Button, CircularProgress } from 'ambient_ui'
import { useMutation } from '@apollo/react-hooks'
import get from 'lodash/get'
import { useSpring, animated, config } from 'react-spring'
// src
import { createNotification as createNotificationAction } from 'redux/slices/notifications'
import { getQueryStringParams } from 'utils'
import { withLayout } from 'hoc'
import AuthLayout from 'layouts/AuthLayout'
import LoginAnimatedCard from 'components/LoginAnimatedCard'

import { SET_PASSWORD } from './gql'
import useStyles from './styles'

// email for password reset -

const ResetPassword = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const history = useHistory()
  const { search } = useLocation()

  const { opacity } = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: config.slow,
  })

  // get Invite Code
  // for https://alpha.ambient.ai/invites?token=a16f8a3451fad7e2d4e8a67c8d4e342c
  //
  let inviteToken
  if (search) {
    const { token } = getQueryStringParams(search)
    inviteToken = token
  }
  // or https://alpha.ambient.ai/invites/a16f8a3451fad7e2d4e8a67c8d4e342c
  //
  const { inviteCode } = useParams() // FUTURE @Rodaan from Eric - this doesn't work on going to above link, it redirects to /login for some reason
  const inviteId = inviteCode || inviteToken

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })

  const [
    setPassword,
    {
      loading: setPasswordLoading,
      error: setPasswordError,
      data: setPasswordData,
    },
  ] = useMutation(SET_PASSWORD, {
    variables: {
      password: form.password,
      confirmPassword: form.confirmPassword,
      inviteCode: inviteId,
    },
  })

  const onResetPassword = async event => {
    event.preventDefault()
    setPassword()
  }

  const onChange = fieldName => e => {
    setForm({
      ...form,
      [fieldName]: e.target.value,
    })
  }

  useEffect(() => {
    if (setPasswordLoading) {
      setLoading(true)
    }
  }, [setPasswordLoading])

  useEffect(() => {
    if (setPasswordError) {
      dispatch(
        createNotificationAction({
          message:
            'Unable to reach Ambient.ai servers. Check your connection or notify us at support@ambient.ai',
        }),
      )
      setLoading(false)
    }
  }, [setPasswordError, dispatch])

  useEffect(() => {
    if (setPasswordData) {
      if (get(setPasswordData, 'setPassword.ok')) {
        setLoading(false)
        history.push('/login')
        dispatch(
          createNotificationAction({
            message: 'Set password successfully',
          }),
        )
      } else {
        dispatch(
          createNotificationAction({
            message: get(setPasswordData, 'setPassword.message'),
          }),
        )
        setLoading(false)
      }
    }
  }, [setPasswordData, dispatch, history])

  return (
    <LoginAnimatedCard>
      <Grid item className={classes.children}>
        <Container component='main' maxWidth='xs'>
          <div className={classes.paper}>
            <LockOutlinedIcon />
            <Typography component='h6' className={classes.title}>
              Set Your Password
            </Typography>
            <animated.form
              className={classes.form}
              noValidate
              style={{ opacity }}
            >
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='password'
                label='Password'
                type='password'
                name='password'
                autoComplete='password'
                autoFocus
                value={form.password}
                onChange={onChange('password')}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='confirmPassword'
                label='Confirm password'
                type='password'
                id='confirmPassword'
                autoComplete='confirmPassword'
                value={form.confirmPassword}
                onChange={onChange('confirmPassword')}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
                onClick={onResetPassword}
                disabled={loading}
              >
                {loading ? <CircularProgress /> : 'Set Password'}
              </Button>
              <Grid container justify='center'>
                <Link to='/login' variant='body2' className={classes.link}>
                  Back to Login
                </Link>
              </Grid>
            </animated.form>
          </div>
        </Container>
      </Grid>
    </LoginAnimatedCard>
  )
}

ResetPassword.defaultProps = {
  createNotification: () => {},
}

ResetPassword.propTypes = {
  inviteCode: PropTypes.string,
  createNotification: PropTypes.func,
}

export default withLayout(AuthLayout)(ResetPassword)
