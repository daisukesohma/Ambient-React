import React from 'react'
import PropTypes from 'prop-types'

import { THIN_TIMELINE_HEIGHT } from './constants'

const TimelineBackground = ({ timelineWidth }) => {
  return (
    <rect
      id="timeline-bg"
      rx="5"
      x="0"
      y="0"
      fill="transparent"
      width={`${timelineWidth}`}
      height={THIN_TIMELINE_HEIGHT}
    />
  )
}

TimelineBackground.defaultProps = {
  timelineWidth: 0,
}

TimelineBackground.propTypes = {
  timelineWidth: PropTypes.number,
}
export default TimelineBackground
