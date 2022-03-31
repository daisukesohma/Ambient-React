import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import moment from 'moment'
// src
import { hexRgba } from 'utils'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import LineMarker from '../LineMarker'

const propTypes = {
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // [date, date]
  xRange: PropTypes.arrayOf(PropTypes.number),
  videoStreamKey: PropTypes.string,
}

function ForensicsMarkers({ xDomain, xRange, videoStreamKey }) {
  const { palette } = useTheme()
  // get data
  const motionSegmentRetentionDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'retention.motionSegmentRetentionDays',
      defaultValue: 0,
    }),
  )

  const nonmotionSegmentRetentionDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'retention.nonmotionSegmentRetentionDays',
      defaultValue: 0,
    }),
  )

  const maxRetentionDays = useMemo(
    () => Math.max(motionSegmentRetentionDays, nonmotionSegmentRetentionDays),
    [motionSegmentRetentionDays, nonmotionSegmentRetentionDays],
  )

  const data = [
    {
      start: moment()
        .startOf('day')
        .subtract(maxRetentionDays, 'days')
        .toDate(),
      end: new Date(),
    },
  ]

  return (
    <LineMarker
      xDomain={xDomain}
      xRange={xRange}
      data={data}
      color={hexRgba(palette.grey[500], 0.5)}
    />
  )
}

ForensicsMarkers.propTypes = propTypes

export default ForensicsMarkers
