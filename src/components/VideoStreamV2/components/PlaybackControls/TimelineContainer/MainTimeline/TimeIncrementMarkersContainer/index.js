import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  VmsPropType,
  VmsPropTypeDefault,
} from '../../../../../../../common/data/proptypes'
import { getInverseZoomTS, tsAtMidnight } from '../../../../../utils'

import {
  convertZoomToPx,
  getLowestIncrementWithinRange,
  getHighestIncrementWithinRange,
} from './utils'
import TimeIncrementMarker from './TimeIncrementMarker'

const TimeIncrementMarkersContainer = props => {
  const {
    svgWidth,
    viewWindowPosition,
    vms: {
      darkMode,
      timeline: {
        settings: { position },
      },
    },
    zoomLevel,
  } = props

  const markers = []
  let markerTs
  let unixTS

  const timeFormat = zoomLevel >= 6 ? 'h:mm:ssA' : 'h:mmA' // hacky based on zoomLevel, make declarative
  // set up left and right window constraints
  const viewWindowEnd = Math.abs(Math.floor(viewWindowPosition))
  const viewWindowWidth = Math.abs(Math.floor(svgWidth))

  // min time of the x-axis markers, go one full width before and after the point
  // if position is at center, then we are going 1/2 width PAST th eend of the visible view, but shouldn't beforea
  //  expensive, we can optimize for the number of xaxis markers put on, but then will add a prop for position and
  //  calculating everything properly, which may be more trouble than its worth.
  const minTime = viewWindowEnd - viewWindowWidth
  const maxTime = viewWindowEnd + viewWindowWidth

  const increment = convertZoomToPx(zoomLevel)
  const majorIncrementPx = increment.major
  const minorIncrementPx = increment.minor

  const lowestMajorMultiple = getLowestIncrementWithinRange(
    minTime,
    maxTime,
    majorIncrementPx,
  )
  const higestMajorMultiple = getHighestIncrementWithinRange(
    minTime,
    maxTime,
    majorIncrementPx,
  )
  const lowestMinorMultiple = getLowestIncrementWithinRange(
    minTime,
    maxTime,
    minorIncrementPx,
  )
  const highestMinorMultiple = getHighestIncrementWithinRange(
    minTime,
    maxTime,
    minorIncrementPx,
  )

  for (
    let i = lowestMinorMultiple;
    i <= highestMinorMultiple;
    i += minorIncrementPx
  ) {
    unixTS = getInverseZoomTS(i, zoomLevel) + tsAtMidnight()
    markerTs = moment.unix(unixTS).format(timeFormat)

    markers.push(
      <TimeIncrementMarker
        darkMode={darkMode}
        xPos={i}
        position={position}
        type='minor'
      />,
    )
  }

  for (
    let i = lowestMajorMultiple;
    i <= higestMajorMultiple;
    i += majorIncrementPx
  ) {
    unixTS = getInverseZoomTS(i, zoomLevel) + tsAtMidnight()
    markerTs = moment.unix(unixTS).format(timeFormat)

    markers.push(
      <TimeIncrementMarker
        label={markerTs}
        darkMode={darkMode}
        xPos={i}
        position={position}
        type='major'
      />,
    )
  }

  return (
    <g className='x-axis' fill='none' fontSize='14' textAnchor='middle'>
      {markers}
    </g>
  )
}

TimeIncrementMarkersContainer.defaultProps = {
  svgWidth: null,
  viewWindowPosition: null,
  vms: VmsPropTypeDefault,
  zoomLevel: 5,
}

TimeIncrementMarkersContainer.propTypes = {
  svgWidth: PropTypes.number,
  viewWindowPosition: PropTypes.number,
  vms: VmsPropType,
  zoomLevel: PropTypes.bool,
}

export default TimeIncrementMarkersContainer
