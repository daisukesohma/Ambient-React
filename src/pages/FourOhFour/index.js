import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { animated, config, useSpring } from 'react-spring'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import clsx from 'clsx'
import get from 'lodash/get'
import some from 'lodash/some'
import { Can } from 'rbac'
// src
import Sidebar from 'components/Sidebar'
import { sidebarOptions as internalMenu } from 'components/Sidebar/menus/internal'
import SupportAccessForm from 'features/Internal/Support/components/SupportAccessForm'
import { fetchAccountsRequested } from 'features/Internal/redux/internalSlice'
import Logo from 'assets/logo_icon.png'

import useStyles from './styles'
import LoadingScreen from 'containers/LoadingScreen'

export default function FourOhFour() {
  const isInternalRouter = !!useRouteMatch('/internal')
  const location = useLocation()
  const dispatch = useDispatch()
  const [isSpinning, setIsSpinning] = useState(true)
  const [loading, setLoading] = useState(false)
  const [speed, setSpeed] = useState(2) // speed 2 is medium
  const darkMode = useSelector(state => state.settings.darkMode)
  const isLoggedIn = useSelector(state => state.auth.loggedIn)
  const account = get(location, 'state.account', null)
  const classes = useStyles()

  const { opacity } = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: config.molasses,
  })

  const accounts = useSelector(state => state.internal.accounts)
  const isInternal = useSelector(state => get(state, 'auth.profile.internal'))
  const [requested, setRequested] = useState(false)

  useEffect(() => {
    if (account) {
      setLoading(true)
      dispatch(fetchAccountsRequested({ onCompleted: () => setLoading(false) }))
    }
  }, [dispatch, account])

  const isValidAccount = some(accounts, { slug: account })

  const handleClick = () => {
    // this will alternate between being off (0) and a random value between 1-3
    const nextSpinState = !isSpinning
    const maxSpeed = 3
    let randomSpeed = Math.floor(Math.random() * (maxSpeed + 1))
    // if it's spinning, always have a spin value
    if (isSpinning && randomSpeed === 0) {
      randomSpeed = 2
    }
    setIsSpinning(nextSpinState)
    setSpeed(nextSpinState ? randomSpeed : 0)
  }

  const getSpeed = () => {
    if (speed === 1) return 'slow as molasses'
    if (speed === 2) return 'just chugging along'
    if (speed === 3) return 'hyper fast'
    return 'off'
  }

  const noAccessText = requested
    ? 'Requested Access!'
    : 'You do not have access to this account.'

  const onRequestClick = () => {
    setRequested(true)
  }

  const sidebarOptions =
    isInternalRouter || (isValidAccount && isInternal) ? internalMenu : {}

  if (loading) return <LoadingScreen />

  return (
    <>
      {isLoggedIn && <Sidebar {...sidebarOptions} />}
      <Grid
        container
        justify='center'
        alignItems='center'
        className={classes.container}
      >
        {isValidAccount ? (
          <Can I='is_internal' on='Admin'>
            <SupportAccessForm
              account={account}
              requested={requested}
              noAccessText={noAccessText}
              darkMode={darkMode}
              onRequestClick={onRequestClick}
            />
          </Can>
        ) : (
          <Grid container justify='center' alignItems='center'>
            <Grid container justify='center' alignItems='center'>
              <span
                className={clsx('am-h1', classes.main, classes.firstNumber)}
              >
                4
              </span>
              <animated.div style={{ opacity }}>
                <img
                  src={Logo}
                  alt='Ambient'
                  className={clsx(
                    classes.logo,
                    { [classes.rotateDiagonalSlow]: isSpinning && speed === 1 },
                    { [classes.rotateDiagonal]: isSpinning && speed === 2 },
                    { [classes.rotateDiagonalFast]: isSpinning && speed === 3 },
                  )}
                  onClick={handleClick}
                />
              </animated.div>
              <span className={clsx('am-h1', classes.main, classes.lastNumber)}>
                4
              </span>
            </Grid>
            <Grid container item justify='center' alignItems='center'>
              <Box style={{ marginTop: 16 }} className='am-h6'>
                Lost? Or just hanging out? Here's a little fidget spinner for
                your travels.
              </Box>
            </Grid>
            {isLoggedIn && (
              <Grid container item justify='center' alignItems='center'>
                <Box
                  style={{ marginTop: 16 }}
                  className={clsx(classes.subText, 'am-h6')}
                >
                  Head home or navigate on the left.
                </Box>
              </Grid>
            )}
            <Grid container item justify='center' alignItems='center'>
              <Box mt={2} className={clsx(classes.subText, 'am-body2')}>
                {speed === 0
                  ? `Or, just click it to get it going.`
                  : `We're ${getSpeed()}. Click to stop spinning.`}
              </Box>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  )
}
