import React, { useMemo, useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { scaleUtc } from '@vx/scale'
import { AxisTop } from '@vx/axis'
import clsx from 'clsx'
// src
import {
  DEFAULT_TIMEZONE,
  formatTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import { durationTime } from '../../../../utils'

const propTypes = {
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  xRange: PropTypes.arrayOf(PropTypes.number),
  timezone: PropTypes.string,
  videoStreamKey: PropTypes.string,
}

const is24hr = false
const hourFormat = is24hr ? 'HH' : 'hh'

const TimelineAxis = ({
  xDomain = [0, 0], // [date, date] d3 domain for a scale
  xRange = [0, 0], // d3 range for scale, this is [0, width]
  timezone = DEFAULT_TIMEZONE,
  videoStreamKey,
}) => {
  const { palette } = useTheme()
  const timeDomainSliderValue = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeDomainSliderValue',
    }),
  )

  // FUTURE: CLEANUP: Can make most of these utility functions a use hook
  //
  const duration = useMemo(() => durationTime(xDomain[0], xDomain[1]), [
    xDomain,
  ])

  const numTicksHours = useMemo(() => duration.asHours(), [duration])
  const countMinutes = useMemo(() => duration.asMinutes(), [duration])
  const numTicksMinutes = useCallback(
    (showInterval, totalMinutes) => totalMinutes / showInterval,
    [],
  )

  const xScale = scaleUtc({
    domain: xDomain,
    range: xRange,
  })

  const scaleDay = useCallback(
    () => ({
      scale: xScale,
      tickFormat: (v, i) => {
        // on hour 0, ie. every day
        if (v.getHours() === 0) {
          return formatTimeWithTZ(v, 'MM/dd', timezone)
        }
        return ''
      },
    }),
    [xScale, timezone],
  )

  // if everyXHours is 2, show a label every two hours
  const scaleHour = useCallback(
    everyXHours => ({
      scale: xScale,
      tickFormat: v => {
        if (v.getHours() % everyXHours === 0) {
          return formatTimeWithTZ(v, `${hourFormat}:mm`, timezone)
        }
        return ''
      },
    }),
    [xScale, timezone],
  )

  const scaleMinuteAndHour = useCallback(
    everyXHours => ({
      scale: xScale,
      tickFormat: v => {
        if (v.getMinutes() === 0) {
          // on the hour
          if (v.getHours() % everyXHours === 0) {
            return formatTimeWithTZ(v, `${hourFormat}:mm`, timezone)
          }
        }

        return ''
      },
    }),
    [xScale, timezone],
  )

  // show every hour on the hour, show every x minute marker
  const scaleMinuteAndEveryHour = useCallback(
    everyXMinutes => ({
      scale: xScale,
      tickFormat: v => {
        // on the hour
        if (v.getMinutes() === 0) {
          return formatTimeWithTZ(v, `${hourFormat}:mm:ss`, timezone)
        }

        if (v.getMinutes() % everyXMinutes === 0) {
          return formatTimeWithTZ(v, `${hourFormat}:mm`, timezone)
        }
        return ''
      },
    }),
    [xScale, timezone],
  )

  // For SliderValue = 0
  // show a mark everyXSeconds
  //
  const scaleSecondsAndEveryMinute = useCallback(
    everyXSeconds => ({
      scale: xScale,
      tickFormat: (v, i) => {
        // on the minute
        if (v.getSeconds() === 0) {
          return formatTimeWithTZ(v, `${hourFormat}:mm:ss`, timezone)
        }
        if (v.getSeconds() % everyXSeconds === 0) {
          return formatTimeWithTZ(v, 'ss', timezone)
        }
        return ''
      },
    }),
    [xScale, timezone],
  )

  // const sliderValueToAxisProps = useMemo(
  //   () => ({
  //     0: {
  //       numTicks: 20, // play with this number to (approx)
  //       scale: scaleSecondsAndEveryMinute(10).scale,
  //       tickFormat: scaleSecondsAndEveryMinute(10).tickFormat,
  //     },
  //     1: {
  //       numTicks: 5 * 4,
  //       scale: scaleSecondsAndEveryMinute(15).scale,
  //       tickFormat: scaleSecondsAndEveryMinute(30).tickFormat,
  //     },
  //     2: {
  //       numTicks: numTicksMinutes(1, countMinutes),
  //       scale: scaleMinuteAndEveryHour(1).scale,
  //       tickFormat: scaleMinuteAndEveryHour(2).tickFormat,
  //     },
  //     3: {
  //       numTicks: numTicksMinutes(1, countMinutes),
  //       scale: scaleMinuteAndEveryHour(1).scale,
  //       tickFormat: scaleMinuteAndEveryHour(4).tickFormat,
  //     },
  //     4: {
  //       numTicks: numTicksMinutes(1, countMinutes),
  //       scale: scaleMinuteAndEveryHour(1).scale,
  //       tickFormat: scaleMinuteAndEveryHour(5).tickFormat,
  //     },
  //     5: {
  //       numTicks: 4 * 6,
  //       scale: scaleMinuteAndEveryHour(10).scale,
  //       tickFormat: scaleMinuteAndEveryHour(30).tickFormat,
  //     },
  //     6: {
  //       numTicks: 12 * 2,
  //       scale: scaleMinuteAndHour(2).scale,
  //       tickFormat: scaleMinuteAndHour(2).tickFormat,
  //     },
  //     7: {
  //       numTicks: numTicksHours,
  //       scale: scaleHour(4).scale,
  //       tickFormat: scaleHour(4).tickFormat,
  //     },
  //     8: {
  //       numTicks: numTicksHours,
  //       scale: scaleHour(6).scale,
  //       tickFormat: scaleHour(6).tickFormat,
  //     },
  //     9: {
  //       numTicks: 7,
  //       scale: scaleDay().scale,
  //       tickFormat: scaleDay().tickFormat,
  //     },
  //   }),
  //   [
  //     countMinutes,
  //     numTicksHours,
  //     numTicksMinutes,
  //     scaleDay,
  //     scaleHour,
  //     scaleMinuteAndEveryHour,
  //     scaleMinuteAndHour,
  //     scaleSecondsAndEveryMinute,
  //   ],
  // )

  const sliderValueToAxisProps = useMemo(
    () => ({
      9: {
        numTicks: 20, // play with this number to (approx)
        scale: scaleSecondsAndEveryMinute(10).scale,
        tickFormat: scaleSecondsAndEveryMinute(10).tickFormat,
      },
      8: {
        numTicks: 5 * 4,
        scale: scaleSecondsAndEveryMinute(15).scale,
        tickFormat: scaleSecondsAndEveryMinute(30).tickFormat,
      },
      7: {
        numTicks: numTicksMinutes(1, countMinutes),
        scale: scaleMinuteAndEveryHour(1).scale,
        tickFormat: scaleMinuteAndEveryHour(2).tickFormat,
      },
      6: {
        numTicks: numTicksMinutes(1, countMinutes),
        scale: scaleMinuteAndEveryHour(1).scale,
        tickFormat: scaleMinuteAndEveryHour(4).tickFormat,
      },
      5: {
        numTicks: numTicksMinutes(1, countMinutes),
        scale: scaleMinuteAndEveryHour(1).scale,
        tickFormat: scaleMinuteAndEveryHour(5).tickFormat,
      },
      4: {
        numTicks: 4 * 6,
        scale: scaleMinuteAndEveryHour(10).scale,
        tickFormat: scaleMinuteAndEveryHour(30).tickFormat,
      },
      3: {
        numTicks: 12 * 2,
        scale: scaleMinuteAndHour(2).scale,
        tickFormat: scaleMinuteAndHour(2).tickFormat,
      },
      2: {
        numTicks: numTicksHours,
        scale: scaleHour(4).scale,
        tickFormat: scaleHour(4).tickFormat,
      },
      1: {
        numTicks: numTicksHours,
        scale: scaleHour(6).scale,
        tickFormat: scaleHour(6).tickFormat,
      },
      0: {
        numTicks: 7,
        scale: scaleDay().scale,
        tickFormat: scaleDay().tickFormat,
      },
    }),
    [
      countMinutes,
      numTicksHours,
      numTicksMinutes,
      scaleDay,
      scaleHour,
      scaleMinuteAndEveryHour,
      scaleMinuteAndHour,
      scaleSecondsAndEveryMinute,
    ],
  )

  if (xRange[1] < 10) return null

  return (
    <>
      <AxisTop
        stroke={'transparent'}
        tickLength={4}
        tickStroke={palette.grey[500]}
        top={20}
        tickLabelProps={
          (/* value, index */) => ({
            fill: palette.grey[500],
            dx: -2,
            dy: -2,
          })
        }
        tickClassName='am-overline'
        {...sliderValueToAxisProps[timeDomainSliderValue]}
      />
      {timeDomainSliderValue <= 3 && (
        <AxisTop
          numTicks={numTicksHours}
          scale={scaleDay(0).scale}
          stroke={'transparent'}
          tickFormat={scaleDay(0).tickFormat}
          tickLength={4}
          tickStroke={palette.grey[500]}
          top={20}
          tickLabelProps={
            (/* value, index */) => ({
              fill: palette.grey[300],
              dy: -2,
              dx: -42,
              fontSize: 12,
            })
          }
          tickClassName={clsx('am-overline')}
        />
      )}
    </>
  )
}

TimelineAxis.propTypes = propTypes

export default TimelineAxis
