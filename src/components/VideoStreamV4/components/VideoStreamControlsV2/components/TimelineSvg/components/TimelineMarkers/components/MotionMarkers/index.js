import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import moment from 'moment'
// src
import { hexRgba, msToUnix } from 'utils'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { fetchStreamCatalogueDataRequested } from 'redux/slices/videoStreamControls'

import LineMarker from '../LineMarker'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // [date, date]
  xRange: PropTypes.arrayOf(PropTypes.number),
  videoStreamKey: PropTypes.string,
}

function MotionMarkers({
  accountSlug,
  siteSlug,
  streamId,
  xDomain,
  xRange,
  videoStreamKey,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  // get data
  const motionCatalog = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'catalogue' }),
  )
  // data accessor
  const getDataStartEnd = useCallback(data => {
    return {
      start: moment.unix(msToUnix(data.startTs)).toDate(),
      end: moment.unix(msToUnix(data.endTs)).toDate(),
    }
  }, [])

  const timeRange = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'timeRange' }),
  )

  // requery catalogue every time timeRange changes in redux
  useEffect(() => {
    if (timeRange) {
      dispatch(
        fetchStreamCatalogueDataRequested({
          videoStreamKey,
          accountSlug,
          siteSlug,
          streamId,
          startTs: moment(timeRange[0]).unix(),
          endTs: moment(timeRange[1]).unix(),
          isInitial: true,
        }),
      )
    }
  }, [timeRange, accountSlug, dispatch, siteSlug, streamId, videoStreamKey])

  if (!motionCatalog) return null

  return (
    <LineMarker
      xDomain={xDomain}
      xRange={xRange}
      data={motionCatalog.map(d => getDataStartEnd(d))}
      color={hexRgba(palette.common.tertiary, 0.9)}
    />
  )
}

MotionMarkers.propTypes = propTypes

export default MotionMarkers
