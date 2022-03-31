import React, { useEffect, useState, useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Box, Drawer, Stepper, Step, StepButton } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import { play } from 'react-icons-kit/fa/play'
import { pause } from 'react-icons-kit/fa/pause'
import clsx from 'clsx'
import some from 'lodash/some'
import get from 'lodash/get'
// src
import { Icons } from 'ambient_ui'
import { simulateAlertEventRequested } from 'components/NewsFeed/feedSlice'
import {
  togglePlayPauseDemo,
  pauseDemo,
  updateStep,
  updateNextTick,
} from 'redux/demo/actions'
import { demoAlerts } from 'utils'

import useStyles from './styles'

const { ArrowUp, ArrowDown } = Icons

DemoPlayback.defaultProps = {
  alertTick: 5,
}

DemoPlayback.propTypes = {
  alertTick: PropTypes.number,
}

export default function DemoPlayback({ alertTick }) {
  const { palette } = useTheme()
  const [expandPlayback, setExpandPlayback] = useState(true)
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ expandPlayback, darkMode })
  const dispatch = useDispatch()
  const playing = useSelector(state => state.demo.playing)

  const alertEvents = useSelector(state => state.feed.alertEvents)
  const activeStep = useSelector(state => state.demo.activeStep)
  const nextTick = useSelector(state => state.demo.nextTick)
  const profileId = useSelector(state => state.auth.profile.id)
  // How many seconds till the next alert
  const { account, site } = useParams()

  const key = `${account}`

  const alerts = demoAlerts[key].corp

  const simulate = params => {
    dispatch(
      simulateAlertEventRequested({
        ...params,
        audience: [profileId],
      }),
    )
  }

  useEffect(() => {
    if (activeStep >= 0 && activeStep < alerts.length) {
      const demoAlert = alerts[activeStep]
      // NOTE: simulate demo alert only if it doesn't exist in current alertEvents collection
      if (!some(alertEvents, { alert: { id: get(demoAlert, 'alertId') } }))
        simulate(demoAlert)
    }
  }, [activeStep, account, alerts, dispatch, site])

  useEffect(() => {
    // Always pause to start with
    dispatch(pauseDemo())
  }, [dispatch])

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        // Trigger next alert and reset nextTick
        if (nextTick <= 0) {
          dispatch(updateStep({ activeStep: activeStep + 1 }))
          dispatch(updateNextTick({ nextTick: alertTick }))
        } else {
          dispatch(updateNextTick({ nextTick: nextTick - 1 }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  const iconProps = useMemo(
    () => ({
      stroke: palette.common.white,
      width: 24,
      height: 24,
    }),
    [],
  )

  if (!alerts) {
    return null
  }

  return (
    <Drawer
      variant='persistent'
      anchor='bottom'
      open
      classes={{ paper: classes.drawer }}
    >
      <Box display='flex' alignItems='center' pl={1} pr={1}>
        <Box display='flex' alignItems='center'>
          <div
            className={classes.displayController}
            onClick={() => setExpandPlayback(!expandPlayback)}
          >
            {expandPlayback ? (
              <ArrowDown {...iconProps} />
            ) : (
              <ArrowUp {...iconProps} />
            )}
          </div>
          <Box pl={1} pr={1}>
            <IconButton
              classes={{ root: classes.playButton }}
              size='medium'
              onClick={() => {
                dispatch(togglePlayPauseDemo())
                dispatch(updateNextTick({ nextTick: alertTick }))
              }}
            >
              <Icon size={20} icon={playing ? pause : play} />
            </IconButton>
          </Box>
        </Box>
        <Box ml={1} width={1}>
          <Stepper
            nonLinear
            alternativeLabel
            variant='progress'
            activeStep={activeStep}
            steps={alerts.length}
            className={classes.stepper}
          >
            {alerts.map((item, index) => {
              const isNext = playing && index === activeStep + 1
              return (
                <Step
                  key={item.alertId}
                  completed={Boolean(index <= activeStep)}
                  classes={{ root: classes.step }}
                >
                  <StepButton
                    onClick={() => {
                      dispatch(updateStep({ activeStep: index }))
                      dispatch(updateNextTick({ nextTick: alertTick }))
                    }}
                    style={{ paddingTop: '5px' }}
                    classes={{
                      horizontal: clsx({ [classes.nextStepButton]: isNext }),
                    }}
                  />
                </Step>
              )
            })}
          </Stepper>
        </Box>
      </Box>
    </Drawer>
  )
}
