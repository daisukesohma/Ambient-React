import React, { useLayoutEffect, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
// src
import Logo from 'assets/logo_icon.png'
import { logoutRequested, logoutInitiateRequested } from 'redux/slices/auth'
import { withLayout } from 'hoc'
import { MixPanelEventEnum } from 'enums'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import AuthLayout from 'layouts/AuthLayout'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    marginTop: '20%',
  },
  logo: {
    width: 80,
  },
  logoutRootBlock: {
    textAlign: 'center',
  },
}))

const Logout = () => {
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const loggingOut = useSelector(state => state.auth.loggingOut)
  const loggedOut = useSelector(state => state.auth.loggedOut)

  useEffect(() => {
    dispatch(logoutInitiateRequested())
  }, [])

  useLayoutEffect(() => {
    if (loggedOut) {
      dispatch(logoutRequested())
      trackEventToMixpanel(MixPanelEventEnum.AUTH_LOGOUT)
      history.push('/login')
    }
  }, [loggedOut])

  const logoutText = loggingOut
    ? 'You are being logged out of Ambient.ai'
    : 'You have been logged out of Ambient.ai'

  return (
    <Grid container className={classes.container}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        className={classes.logoutRootBlock}
      >
        <img src={Logo} alt='Ambient' className={classes.logo} />
        <div style={{ fontWeight: 'normal' }}>{logoutText}</div>
      </Grid>
    </Grid>
  )
}

export default withLayout(AuthLayout)(Logout)
