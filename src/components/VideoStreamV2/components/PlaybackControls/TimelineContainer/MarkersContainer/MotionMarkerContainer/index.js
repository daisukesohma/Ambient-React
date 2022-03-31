/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import {
  getCurrUnixTimestamp,
  getZoomTS,
  getInverseZoomTS,
  tsAtMidnight,
} from '../../../../../utils'
import { SEC_IN_DAY } from '../../../../../utils/constants'

import MotionMarker from './MotionMarker'

const filterCatalog = (catalog, selectedTS, zoomLevel) => {
  // calculate range in either direction
  let rangeInHours
  if (zoomLevel > 5) {
    // if zoomed in, make range less
    rangeInHours = 2
  } else if (zoomLevel < 5) {
    rangeInHours = 18 // else if zoomed out, make max range
  } else {
    rangeInHours = 3 // default 3 hour range
  }
  const rangeInSeconds = 3600 * rangeInHours

  const rangeStartTs = selectedTS - rangeInSeconds
  const rangeEndTs = selectedTS + rangeInSeconds

  if (catalog.length > 0) {
    return catalog.filter(el => {
      const elEndTs = el.end_ts / 1000
      const elStartTs = el.start_ts / 1000
      // get only elements in the catalog that are within range
      return elEndTs >= rangeStartTs && elStartTs <= rangeEndTs
    })
  }

  // default return empty
  return []
}

const MotionMarkerContainer = ({
  catalog,
  subtractDays,
  viewWindowPosition,
  zoomLevel,
}) => {
  const markers = []

  // Render the catalog markers if there is catalog
  if (catalog) {
    const zoomedViewWindowPosition = getInverseZoomTS(
      viewWindowPosition,
      zoomLevel,
    )
    const filtered = filterCatalog(
      catalog,
      Math.abs(zoomedViewWindowPosition) + tsAtMidnight(subtractDays),
      zoomLevel,
    )

    let curr
    let currWidth
    let currX = 0
    let max

    for (let i = 0; i < filtered.length; ++i) {
      curr = filtered[i]
      const { end_ts, start_ts } = curr
      max = getZoomTS(SEC_IN_DAY, zoomLevel)

      if (subtractDays > 0) {
        currWidth = Math.min(
          (end_ts - start_ts) / 1000,
          tsAtMidnight(subtractDays - 1) - start_ts / 1000,
        )
      } else if (subtractDays === 0) {
        currWidth = Math.min(
          (end_ts - start_ts) / 1000,
          getCurrUnixTimestamp() - start_ts / 1000,
        )
      }

      currX = start_ts / 1000 - tsAtMidnight(subtractDays)
      currWidth = getZoomTS(currWidth, zoomLevel)
      currX = getZoomTS(currX, zoomLevel)

      if (currX <= max && !Number.isNaN(currX)) {
        // eslint-disable-line
        markers.push(
          <MotionMarker
            key={currX}
            startTs={start_ts / 1000}
            endTs={end_ts / 1000}
            width={currWidth}
            x={currX}
          />,
        )
      }
    }
  }

  return <g id='timeline-datapoints-motion-markers'>{markers}</g>
}

MotionMarkerContainer.defaultProps = {
  catalog: [],
  subtractDays: 0,
  viewWindowPosition: 0,
  zoomLevel: 5,
}

MotionMarkerContainer.propTypes = {
  catalog: PropTypes.array,
  subtractDays: PropTypes.number,
  viewWindowPosition: PropTypes.number,
  zoomLevel: PropTypes.number,
}

export default MotionMarkerContainer
