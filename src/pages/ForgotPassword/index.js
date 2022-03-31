import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Container from '@material-ui/core/Container'
import { Button, CircularProgress } from 'ambient_ui'
import { useMutation } from '@apollo/react-hooks'
import { useSpring, animated, config } from 'react-spring'
import clsx from 'clsx'
import { createNotification } from 'redux/slices/notifications'

import LoginAnimatedCard from '../../components/LoginAnimatedCard'
import { withLayout } from '../../hoc'
import AuthLayout from 'layouts/AuthLayout'

import { SET_PASSWORD_REQUEST } from './gql'
import useStyles from './styles'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { opacity } = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: config.slow,
  })

  const [
    setPasswordRequest,
    {
      loading: setPasswordRequestLoading,
      error: setPasswordRequestError,
      data: setPasswordRequestData,
    },
  ] = useMutation(SET_PASSWORD_REQUEST, { variables: { email } })

  const onEmailSend = async event => {
    event.preventDefault()
    // TODO: Backend integration
    setPasswordRequest()
  }

  const onChangeEmail = e => {
    setEmail(e.target.value)
  }

  useEffect(() => {
    if (setPasswordRequestLoading) {
      setLoading(true)
    }
  }, [setPasswordRequestLoading])

  useEffect(() => {
    if (setPasswordRequestError) {
      dispatch(
        createNotification({
          message:
            'Unable to reach Ambient.ai servers. Check your connection or notify us at support@ambient.ai',
        }),
      )
      setLoading(false)
    }
  }, [setPasswordRequestError, dispatch])

  useEffect(() => {
    if (setPasswordRequestData) {
      if (setPasswordRequestData.setPasswordRequest.ok) {
        setLoading(false)
        setIsEmailSent(true)
      } else {
        dispatch(
          createNotification({
            message: setPasswordRequestData.setPasswordRequest.message,
          }),
        )
        setLoading(false)
      }
    }
  }, [setPasswordRequestData, dispatch])

  return (
    <LoginAnimatedCard>
      <animated.div style={{ opacity }}>
        <Grid className={classes.children}>
          <Container component='main' maxWidth='xs'>
            <div className={classes.paper}>
              <LockOutlinedIcon />
              <div className={clsx('am-body1', classes.title)}>
                Forgot Password?
              </div>
              {isEmailSent ? (
                <div className={clsx('am-subtitle2', classes.description)}>
                  An email is on its way to you. Follow the instructions to
                  reset your password.
                </div>
              ) : (
                <>
                  <div className={clsx('am-subtitle2', classes.description)}>
                    Enter your email address below and we'll email you a reset
                    link.
                  </div>
                  <form className={classes.form} noValidate>
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
                      value={email}
                      onChange={onChangeEmail}
                    />
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}
                      onClick={onEmailSend}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress /> : 'Send Reset Link'}
                    </Button>
                    <Grid container justify='center'>
                      <Link
                        to='/login'
                        variant='body2'
                        className={classes.link}
                      >
                        Back to Login
                      </Link>
                    </Grid>
                  </form>
                </>
              )}
            </div>
          </Container>
        </Grid>
      </animated.div>
    </LoginAnimatedCard>
  )
}

export default withLayout(AuthLayout)(ForgotPassword)
