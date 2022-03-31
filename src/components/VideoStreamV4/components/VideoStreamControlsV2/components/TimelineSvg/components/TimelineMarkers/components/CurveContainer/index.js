import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
// src
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { toggleMetadataCurveVisible } from 'redux/slices/videoStreamControls'

import Curve from '../Curve'
import { queryEntityWithRange } from '../../../../../../utils'
import { CURVE_ICONS } from '../../../../../../constants'

import { metadataCurveVisibleMock, metadataMock } from './mockData'
import getEnrichedData from './utils'

const propTypes = {
  initialQueries: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  height: PropTypes.number,
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  xRange: PropTypes.arrayOf(PropTypes.number),
  getMetadata: PropTypes.func,
  videoStreamKey: PropTypes.string,
}

const defaultProps = {
  initialQueries: [CURVE_ICONS[0].query],
}

const CurveContainer = ({
  initialQueries,
  height,
  xDomain,
  xRange,
  getMetadata,
  videoStreamKey,
}) => {
  const useMockData = false
  const dispatch = useDispatch()
  const [data, setData] = useState([])

  const metadataRedux = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'metadata',
    }),
  )

  const timeRange = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeRange',
    }),
  )

  const metadataSparse = useMockData ? metadataMock : metadataRedux

  const metadataCurveVisibleRedux = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'metadataCurveVisible',
    }),
  )

  const metadataCurveVisible = useMockData
    ? metadataCurveVisibleMock
    : metadataCurveVisibleRedux

  // "curvesData" is an array of arrays of { date, value } objects.
  // each top level array represents one line. If curvesData has [[1], [2], [3]], it will render three curves
  //
  // NOTE: This is where we can optimize the number of points in the dataset.
  // If this number is too large, will need to do some trimming of values here
  //

  useEffect(() => {
    if (timeRange) {
      const metadata = getEnrichedData(timeRange, metadataSparse)

      if (metadataCurveVisible) {
        const curvesData = Object.keys(metadata).map(k => {
          return {
            data: metadata[k],
            color: CURVE_ICONS.find(i => i.key === k).activeColor,
            visible: metadataCurveVisible[k],
          }
        })

        setData(curvesData)
      }
    }
  }, [timeRange, metadataSparse, metadataCurveVisible]) // eslint-disable-line

  useEffect(() => {
    initialQueries.forEach(query => {
      queryEntityWithRange(query, timeRange, getMetadata)

      dispatch(
        toggleMetadataCurveVisible({
          videoStreamKey,
          metadataKey: CURVE_ICONS.find(i => i.query === query).key,
          visible: true, // will this work properly?
        }),
      )
    })
  }, [videoStreamKey]) // eslint-disable-line

  return (
    <Curve
      width={1760}
      height={height}
      data={data}
      xDomain={xDomain}
      xRange={xRange}
    />
  )
}

CurveContainer.propTypes = propTypes
CurveContainer.defaultProps = defaultProps

export default CurveContainer
