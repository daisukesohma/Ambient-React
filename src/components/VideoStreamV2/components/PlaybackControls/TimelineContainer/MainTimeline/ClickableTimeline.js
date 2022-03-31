import React from 'react'
import PropTypes from 'prop-types'

import { THIN_TIMELINE_HEIGHT, TIMELINE_CLICKABLE_HEADROOM } from './constants'

const ClickableTimeline = ({
  onMouseDown,
  onMouseLeave,
  onTimelineHover,
  timelineContainer,
  timelineWidth,
  waiting,
}) => {
  return (
    <rect
      id='clickable timeline'
      className={`interactible ${waiting}`}
      ref={timelineContainer}
      onMouseMove={onTimelineHover}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      transform='translate(0)'
      x='0'
      y={-TIMELINE_CLICKABLE_HEADROOM}
      fill='transparent'
      width={`${timelineWidth}`}
      height={THIN_TIMELINE_HEIGHT + TIMELINE_CLICKABLE_HEADROOM}
    />
  )
}

ClickableTimeline.defaultProps = {
  onMouseDown: () => {},
  onMouseLeave: () => {},
  onTimelineHover: () => {},
  timelineContainer: 0,
  timelineWidth: 0,
  waiting: '',
}
ClickableTimeline.propTypes = {
  onMouseDown: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onTimelineHover: PropTypes.func,
  timelineContainer: PropTypes.number,
  timelineWidth: PropTypes.number,
  waiting: PropTypes.string,
}
export default ClickableTimeline
