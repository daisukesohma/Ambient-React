import React from 'react'
import { useSelector } from 'react-redux'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
// src
import { withLayout } from 'hoc'
import LoginAnimatedCard from 'components/LoginAnimatedCard'
import AuthLayout from 'layouts/AuthLayout'

import AmbientLogin from './components/AmbientLogin'
import SSOLogin from './components/SSOLogin'
import TwoFactorConfirm from './components/TwoFactorConfirm'
import useStyles from './styles'
import { ReducerProps } from './redux/loginSlice'
import { VIEWS } from './enums'

function Login(): JSX.Element {
  const classes = useStyles()
  const view = useSelector((state: ReducerProps) => state.login.view)

  return (
    <LoginAnimatedCard>
      <Grid className={classes.children}>
        <Container component='main' maxWidth='xs'>
          {view === VIEWS.LOGIN && <AmbientLogin />}
          {view === VIEWS.SSO_LOGIN && <SSOLogin />}
          {view === VIEWS.MFA_VERIFY && <TwoFactorConfirm />}
        </Container>
      </Grid>
    </LoginAnimatedCard>
  )
}

export default withLayout(AuthLayout)(Login)
