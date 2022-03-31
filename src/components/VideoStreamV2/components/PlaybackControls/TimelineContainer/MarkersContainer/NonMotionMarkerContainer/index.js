/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import {
  getCurrUnixTimestamp,
  getZoomTS,
  tsAtMidnight,
  secSinceMidnight,
} from '../../../../../utils'
import { SEC_IN_DAY } from '../../../../../utils/constants'

import NonMotionMarker from './NonMotionMarker'

const NonMotionMarkerContainer = ({
  isHoveringOnTimeline,
  retention,
  subtractDays,
  withinNonMotionRetentionDuration,
  zoomLevel,
}) => {
  const markers = []
  // Renders the non motion marker
  // Check if current day selected is today (subtractDays === 0)
  const nonMotionTs =
    subtractDays > 0 ? tsAtMidnight(subtractDays - 1) : getCurrUnixTimestamp()

  // calculate
  if (withinNonMotionRetentionDuration(nonMotionTs)) {
    let nonMotionX = 0
    let nonMotionWidth =
      subtractDays > 0 ? SEC_IN_DAY : secSinceMidnight(getCurrUnixTimestamp())
    if (subtractDays === 0) {
      // If it is current day
      nonMotionWidth = secSinceMidnight(getCurrUnixTimestamp())
    } else if (subtractDays === retention.nonmotion_segment_retention_days) {
      // Check to see if subtractDays is last day in retention
      nonMotionX = secSinceMidnight(getCurrUnixTimestamp())
      nonMotionWidth = SEC_IN_DAY - nonMotionX
    } else {
      // If it is not the current day or the last retention day, then whole day is available to click
      nonMotionWidth = SEC_IN_DAY
    }

    // make proportional to zoomlevel
    nonMotionWidth = getZoomTS(nonMotionWidth, zoomLevel)
    nonMotionX = getZoomTS(nonMotionX, zoomLevel)

    const nonmotionStartTs = tsAtMidnight(subtractDays)
    const nonmotionEndTs =
      subtractDays > 0 ? nonmotionStartTs + SEC_IN_DAY : getCurrUnixTimestamp()

    markers.push(
      <NonMotionMarker
        key={nonMotionX}
        isHoveringOnTimeline={isHoveringOnTimeline}
        startTs={nonmotionStartTs}
        endTs={nonmotionEndTs}
        x={nonMotionX}
        width={nonMotionWidth}
      />,
    )
  }

  return <g id='timeline-datapoints-nonmotion-markers'>{markers}</g>
}

NonMotionMarkerContainer.defaultProps = {
  isHoveringOnTimeline: false,
  retention: {},
  subtractDays: 0,
  withinNonMotionRetentionDuration: () => {},
  zoomLevel: 5,
}

NonMotionMarkerContainer.propTypes = {
  isHoveringOnTimeline: PropTypes.bool,
  retention: PropTypes.object,
  subtractDays: PropTypes.number,
  withinNonMotionRetentionDuration: PropTypes.func,
  zoomLevel: PropTypes.number,
}
export default NonMotionMarkerContainer
