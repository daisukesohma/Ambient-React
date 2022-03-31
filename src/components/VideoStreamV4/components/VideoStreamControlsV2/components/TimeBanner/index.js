import React from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import FlipNumbers from 'react-flip-numbers'
import clsx from 'clsx'
import { useFlexStyles, useFuturisticStyles } from 'common/styles/commonStyles'
// src
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import {
  DEFAULT_TIMEZONE,
  formatTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import { StreamStateEnum } from 'enums'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import useStyles from './styles'

const propTypes = {
  timezone: PropTypes.string,
  videoStreamKey: PropTypes.string,
}

const defaultProps = {
  timezone: DEFAULT_TIMEZONE,
}

// temporary control of 12 or 24 hour clock
const is24hr = false
const timeFormat = is24hr ? 'HH:mm:ss' : 'hh:mm:ss'

const TimeBanner = ({ videoStreamKey, timezone }) => {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const classes = useStyles()
  const futuristicClasses = useFuturisticStyles()

  const isPlaying =
    useSelector(getStreamFeedData({ videoStreamKey, property: 'status' })) ===
    StreamStateEnum.PLAYING

  const playTime = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playTime',
    }),
  )

  if (!playTime) return null

  return (
    <div className={classes.root}>
      <Tooltip content={<TooltipText>Current Play Time</TooltipText>}>
        <div
          className={clsx(
            'am-subtitle1',
            flexClasses.row,
            flexClasses.centerStart,
            classes.tooltipRoot,
            futuristicClasses.iceSheet,
          )}
        >
          <FlipNumbers
            height={14}
            width={14}
            color={palette.primary[500]}
            background='transparent'
            play
            perspective={100}
            numbers={formatTimeWithTZ(playTime, timeFormat, timezone)}
          />
          {!isPlaying && (
            <FlipNumbers
              height={10}
              width={10}
              color={palette.primary[600]}
              background='transparent'
              play
              perspective={100}
              numbers={formatTimeWithTZ(playTime, '.SS', timezone)}
            />
          )}
          <span
            className='am-overline'
            style={{ marginLeft: 8, whiteSpace: 'nowrap' }}
          >
            {formatTimeWithTZ(playTime, 'aa zzz', timezone)}
          </span>
        </div>
      </Tooltip>
    </div>
  )
}

TimeBanner.propTypes = propTypes
TimeBanner.defaultProps = defaultProps

export default TimeBanner
