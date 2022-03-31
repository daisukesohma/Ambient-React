import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Smartphone from '@material-ui/icons/Smartphone'
import Container from '@material-ui/core/Container'
import { Button, CircularProgress } from 'ambient_ui'
import { useSpring, animated, config } from 'react-spring'
import clsx from 'clsx'
// src
import LoginAnimatedCard from 'components/LoginAnimatedCard'
import AuthLayout from 'layouts/AuthLayout'
import { withLayout } from 'hoc'

import useStyles from './styles'

function VerifyPhone() {
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const loading = false

  const { opacity } = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: config.slow,
  })

  // const STEP = 'ADD_PHONE'
  const STEP = 'CONFIRM_PHONE'

  const onVerify = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    // TODO: Backend integration
  }

  const onChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setEmail(event.target.value)
  }

  const addPhoneForm = (
    <form className={classes.form} noValidate>
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id='phone'
        label='Phone'
        name='phone'
        autoComplete='phone'
        autoFocus
        value={email}
        onChange={onChange}
      />

      <Button
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
        className={classes.submit}
        onClick={onVerify}
        disabled={loading}
      >
        {loading ? <CircularProgress /> : 'Verify'}
      </Button>
      <Grid container justify='center'>
        <Link to='/login' className={classes.link}>
          Back to Login
        </Link>
      </Grid>
    </form>
  )

  const verifyPhoneForm = (
    <form className={classes.form} noValidate>
      <TextField
        variant='outlined'
        margin='normal'
        required
        fullWidth
        id='phone'
        label='Confirmation Code'
        name='phone'
        autoComplete='phone'
        autoFocus
        value={email}
        onChange={onChange}
      />

      <Button
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
        className={classes.submit}
        onClick={onVerify}
        disabled={loading}
      >
        {loading ? <CircularProgress /> : 'Verify'}
      </Button>
      <Grid container justify='center'>
        <Link to='/login' className={classes.link}>
          Back to Login
        </Link>
      </Grid>
    </form>
  )

  const secondaryText =
    STEP === 'CONFIRM_PHONE'
      ? 'Enter confirmation code that you received on your phone'
      : "Let's make your account more safety"

  return (
    <LoginAnimatedCard>
      <animated.div style={{ opacity }}>
        <Grid className={classes.children}>
          <Container component='main' maxWidth='xs'>
            <div className={classes.paper}>
              <Smartphone />
              <div className={clsx('am-body1', classes.title)}>
                Verify your phone for multi-factor authentication
              </div>
              <div className={clsx('am-subtitle2', classes.description)}>
                {secondaryText}
              </div>
              {STEP === 'CONFIRM_PHONE' ? verifyPhoneForm : addPhoneForm}
            </div>
          </Container>
        </Grid>
      </animated.div>
    </LoginAnimatedCard>
  )
}

export default withLayout(AuthLayout)(VerifyPhone)
