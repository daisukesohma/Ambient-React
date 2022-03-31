import React, {
  useCallback,
  useMemo,
  useState,
  Fragment,
  useEffect,
} from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Ticker from 'react-ticker'
import { useSelector, useDispatch } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import truncate from 'lodash/truncate'
import parseInt from 'lodash/parseInt'
import every from 'lodash/every'
import {
  PlayArrow,
  SkipNext,
  SkipPrevious,
  Pause,
  ExpandLess,
  ExpandMore,
  Timer,
} from '@material-ui/icons'
import { Box } from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import { useHover } from 'react-use-gesture'
import { StreamStateEnum } from 'enums'

import { useInterval } from '../../common/hooks'
import { MoreOptionMenu } from '../../ambient_ui'
import Tooltip from '../Tooltip'
import TooltipText from '../Tooltip/TooltipText'
import usePrevious from '../../common/hooks/usePrevious'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'

import {
  fetchPlayListRequested,
  setActiveVideoWall,
  togglePlayer,
  toggleBar,
  updateDurationRequested,
  previousVideoWall,
  nextVideoWall,
  removeVideoWallRequested,
  updateTimer,
  MIN_DURATION,
} from './videoWallPlayerSlice'
import useStyles from './styles'

const propTypes = {
  onVideoWallChange: PropTypes.func,
}

const defaultProps = {
  onVideoWallChange: () => {},
}

function TickerLabel() {
  const activeVideoWall = useSelector(
    state => state.videoWallPlayer.activeVideoWall,
  )
  const streams = useSelector(state => state.webrtc.streams)

  const allReady = every(streams, stream => {
    return stream.status === StreamStateEnum.PLAYING
  })

  if (activeVideoWall.name) {
    if (!allReady) {
      return `${activeVideoWall.name} - Loading`
    }
    return `${activeVideoWall.name}`
  }
  return 'Wall Rotation'
}

function VideoWallPlayer({ onVideoWallChange }) {
  const dispatch = useDispatch()
  const { account } = useParams()

  const darkMode = useSelector(state => state.settings.darkMode)
  const activeVideoWall = useSelector(
    state => state.videoWallPlayer.activeVideoWall,
  )
  const videoWalls = useSelector(state => state.videoWallPlayer.videoWalls)
  const timer = useSelector(state => state.videoWallPlayer.timer)
  const duration = useSelector(state => state.videoWallPlayer.duration)
  const isPlayed = useSelector(state => state.videoWallPlayer.isPlayed)
  const isOpened = useSelector(state => state.videoWallPlayer.isOpened)
  const streams = useSelector(state => state.webrtc.streams)
  const classes = useStyles({ darkMode, isOpened })

  const prevActiveVideoWall = usePrevious(activeVideoWall)

  const [timerPopoverAnchorEl, setTimerPopoverAnchorEl] = useState(null)
  const [currentDuration, setCurrentDuration] = useState(duration)

  const [showControls, setShowControls] = useState(false)

  useEffect(() => {
    setCurrentDuration(duration)
  }, [duration])

  useEffect(() => {
    dispatch(fetchPlayListRequested({ account }))
  }, [dispatch, account])

  useEffect(() => {
    if (
      !isEmpty(activeVideoWall) &&
      get(prevActiveVideoWall, 'id') !== get(activeVideoWall, 'id')
    ) {
      onVideoWallChange(activeVideoWall)
    }
  }, [activeVideoWall, onVideoWallChange, prevActiveVideoWall])

  const tickCallback = useCallback(() => {
    // Check all video walls are stream to stream before counting
    const allReady = every(streams, stream => {
      return stream.status === StreamStateEnum.PLAYING
    })

    if (allReady && isPlayed) {
      dispatch(updateTimer())
      if (timer >= duration) {
        trackEventToMixpanel(MixPanelEventEnum.VIDEO_WALL_ROTATED)
        dispatch(nextVideoWall())
      }
    }
  }, [dispatch, timer, isPlayed, duration, streams])

  useInterval(tickCallback, 1000)

  const handlePreviousWall = useCallback(() => {
    dispatch(previousVideoWall())
  }, [dispatch])

  const handleNextWall = useCallback(() => {
    dispatch(nextVideoWall())
  }, [dispatch])

  const handleRemoveWall = useCallback(
    videoWall => {
      dispatch(removeVideoWallRequested({ videoWall, account }))
    },
    [dispatch, account],
  )

  const handleToggleDuration = useCallback(event => {
    setTimerPopoverAnchorEl(event.currentTarget)
  }, [])

  const handleChangeDuration = useCallback(
    event => {
      const newDuration = parseInt(currentDuration)
      dispatch(
        updateDurationRequested({
          duration: newDuration < MIN_DURATION ? MIN_DURATION : newDuration,
          account,
        }),
      )
      setTimerPopoverAnchorEl(null)
    },
    [dispatch, currentDuration, setTimerPopoverAnchorEl, account],
  )

  const handleTogglePlayer = useCallback(() => {
    dispatch(togglePlayer())
  }, [dispatch])

  const handleToggleBar = useCallback(() => {
    dispatch(toggleBar())
  }, [dispatch])

  const isActiveWall = useCallback(
    videoWall => {
      return activeVideoWall.id === videoWall.id
    },
    [activeVideoWall],
  )

  const progress = useMemo(() => (100 / duration) * timer, [duration, timer])

  const hover = useHover(({ hovering }) => {
    if (hovering) {
      setShowControls(true)
    } else if (!isOpened) {
      setShowControls(false)
    }
  })

  return (
    <div className={classes.root} {...hover()}>
      <Grid
        container
        direction='row'
        justify='space-between'
        alignItems='center'
        className={classes.header}
      >
        {showControls && (
          <Grid
            container
            direction='row'
            justify='space-between'
            alignItems='flex-start'
            className={classes.controls}
          >
            <Tooltip
              placement='top'
              content={
                <TooltipText text={`Current interval ${duration} seconds`} />
              }
            >
              <>
                <Timer
                  onClick={handleToggleDuration}
                  className={classes.icon}
                />
                <Popover
                  open={Boolean(timerPopoverAnchorEl)}
                  anchorEl={timerPopoverAnchorEl}
                  onClose={() => setTimerPopoverAnchorEl(null)}
                >
                  <Grid
                    container
                    direction='row'
                    justify='center'
                    alignItems='center'
                    className={classes.durationPopover}
                  >
                    <TextField
                      id='standard-basic'
                      label='Duration in seconds (min 15)'
                      type='number'
                      value={currentDuration}
                      className={classes.durationText}
                      inputProps={{ min: MIN_DURATION }}
                      onChange={event => {
                        setCurrentDuration(parseInt(event.currentTarget.value))
                      }}
                    />
                    <Button
                      onClick={() => {
                        setCurrentDuration(duration)
                        setTimerPopoverAnchorEl(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangeDuration}
                      variant='contained'
                      color='primary'
                      disabled={currentDuration < MIN_DURATION}
                    >
                      Apply
                    </Button>
                  </Grid>
                </Popover>
              </>
            </Tooltip>
            <Tooltip
              placement='top'
              content={<TooltipText text='Go to previous Video Wall' />}
            >
              <SkipPrevious
                onClick={handlePreviousWall}
                className={classes.icon}
              />
            </Tooltip>

            {isPlayed ? (
              <Pause onClick={handleTogglePlayer} className={classes.icon} />
            ) : (
              <PlayArrow
                onClick={handleTogglePlayer}
                className={classes.icon}
              />
            )}
            <Tooltip
              placement='top'
              content={<TooltipText text='Go to next Video Wall' />}
            >
              <SkipNext onClick={handleNextWall} className={classes.icon} />
            </Tooltip>

            {isOpened ? (
              <ExpandMore onClick={handleToggleBar} className={classes.icon} />
            ) : (
              <ExpandLess onClick={handleToggleBar} className={classes.icon} />
            )}
          </Grid>
        )}

        <Grid item xs={12} className={classes.progress}>
          <Box className={classes.tickerContainer}>
            <Ticker height={20} speed={2} mode='smooth' move={isPlayed}>
              {() => (
                <div className={clsx('am-overline', classes.wallRotationLabel)}>
                  <TickerLabel />
                </div>
              )}
            </Ticker>
          </Box>

          <LinearProgress
            color='secondary'
            variant='determinate'
            value={progress}
          />
        </Grid>
      </Grid>

      {isOpened && (
        <Grid className={classes.body}>
          <Grid container direction='column' className={classes.column}>
            <Grid item className={classes.groupHeader}>
              Video Wall Playlist
            </Grid>

            {isEmpty(videoWalls) ? (
              <Grid container justify='center' className={classes.emptyList}>
                No Video Walls
              </Grid>
            ) : (
              videoWalls.map(videoWall => (
                <Grid
                  key={videoWall.id}
                  container
                  direction='row'
                  justify='space-between'
                  alignItems='center'
                  className={clsx(classes.item, {
                    [classes.activeItem]: isActiveWall(videoWall),
                  })}
                >
                  <Tooltip
                    placement='top'
                    className={classes.nameBlock}
                    content={<TooltipText text={videoWall.name} />}
                  >
                    <Box
                      onClick={() => {
                        dispatch(setActiveVideoWall({ videoWall }))
                      }}
                      className={classes.nameBlock}
                      pl={1.5}
                    >
                      {truncate(videoWall.name, {
                        length: 25,
                      })}
                    </Box>
                  </Tooltip>
                  <Box pr={1.5}>
                    <MoreOptionMenu
                      noBackground
                      darkMode={darkMode}
                      menuItems={[
                        {
                          label: 'Remove',
                          onClick: () => handleRemoveWall(videoWall),
                        },
                      ]}
                    />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      )}
    </div>
  )
}

VideoWallPlayer.propTypes = propTypes
VideoWallPlayer.defaultProps = defaultProps

export default VideoWallPlayer
