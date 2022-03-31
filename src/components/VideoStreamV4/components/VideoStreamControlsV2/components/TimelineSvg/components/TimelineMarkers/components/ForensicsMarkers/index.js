import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import moment from 'moment'
// src
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
  const forensicsData = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'results',
    }),
  )

  // data accessor
  const getDataStartEnd = useCallback(startTs => {
    return {
      start: moment.unix(startTs / 1000).toDate(),
      end: moment
        .unix(startTs / 1000)
        .add(30, 'seconds')
        .toDate(),
    }
  }, [])

  if (!forensicsData) return null

  return (
    <LineMarker
      xDomain={xDomain}
      xRange={xRange}
      data={forensicsData.map(d => getDataStartEnd(d.ts))}
      color={palette.secondary[500]}
    />
  )
}

ForensicsMarkers.propTypes = propTypes

export default ForensicsMarkers
