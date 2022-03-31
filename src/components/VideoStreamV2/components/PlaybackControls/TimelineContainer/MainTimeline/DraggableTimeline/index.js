import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

import {
  DRAG_HEIGHT,
  DRAG_EXPAND_HEIGHT,
  THIN_TIMELINE_HEIGHT,
} from '../constants'
import { throttle } from '../../../../../../../utils'
import './index.css'
import { SEC_IN_DAY } from '../../../../../utils/constants'
import { getZoomTS } from '../../../../../utils'

const THROTTLE_DRAG_MS = 10 // throttles call to move dragged timeline to once per xMs

const DraggableTimeline = ({
  onDrag,
  onDraggableTimelineHover,
  onDraggableTimelineHoverOff,
  handleStopDragging,
  zoomLevel,
  ...props
}) => {
  DraggableTimeline.handleClickOutside = () => {
    handleMouseUpWithoutEvents()
  }

  const [coordX, setCoordX] = useState()
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = e => {
    if (isDragging && coordX && e.pageX) {
      const xDiff = coordX - e.pageX
      onDrag(xDiff)
      setCoordX(e.pageX) // set new value, so if user changes direction, it moves according to latest value/direction, not just the original grab point
    }
  }

  // In functional component, useRef is used in place of .bind(this) to store a reference to throttled function (in order to add and remove event listener)
  // https://medium.com/@rajeshnaroth/using-throttle-and-debounce-in-a-react-function-component-5489fc3461b3
  const throttledMouseMove = useRef(throttle(handleMouseMove, THROTTLE_DRAG_MS))
    .current

  const handleMouseDown = e => {
    setIsDragging(true)
    setCoordX(e.pageX)
    expandDraggableArea(e)
    window.addEventListener('mousemove', throttledMouseMove, false)
  }

  const handleMouseUp = e => {
    handleMouseUpWithoutEvents()
    handleMouseUpWithEvents(e)
  }

  const handleMouseUpWithoutEvents = () => {
    window.removeEventListener('mousemove', throttledMouseMove, false)
    setIsDragging(false)
    setCoordX(null)
    handleStopDragging()
    onDraggableTimelineHoverOff()
  }

  const handleMouseUpWithEvents = e => {
    resetDraggableArea(e)
  }

  const handleMouseLeave = e => {
    if (!isDragging) {
      // don't do anything on dragging
      handleMouseUp(e)
    }
    // handleMouseUp(e)
  }

  const handleMouseEnter = e => {
    onDraggableTimelineHover()
  }

  // Expands draggable area on hover to be above the timeline
  let expandDraggableArea = e => {
    e.target.setAttribute('height', DRAG_EXPAND_HEIGHT + DRAG_HEIGHT)
    e.target.setAttribute('y', -DRAG_EXPAND_HEIGHT) // move the drag area up
  }

  // Resets draggable hover area to be below the timeline
  let resetDraggableArea = e => {
    e.target.setAttribute('height', DRAG_HEIGHT)
    e.target.setAttribute('y', 0)
  }

  return (
    <rect
      id='draggable-timeline-area'
      className='draggable'
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      transform={`translate(0, ${THIN_TIMELINE_HEIGHT})`}
      x='0'
      y='0'
      fill='transparent'
      width={getZoomTS(SEC_IN_DAY, zoomLevel)}
      height={DRAG_HEIGHT}
    />
  )
}

const clickOutsideConfig = {
  handleClickOutside: () => DraggableTimeline.handleClickOutside,
}
DraggableTimeline.prototype = {}

DraggableTimeline.defaultProps = {
  onDrag: () => {},
  onDraggableTimelineHover: () => {},
  onDraggableTimelineHoverOff: () => {},
  handleStopDragging: () => {},
  zoomLevel: 5,
}

DraggableTimeline.propTypes = {
  onDrag: PropTypes.func,
  onDraggableTimelineHover: PropTypes.func,
  onDraggableTimelineHoverOff: PropTypes.func,
  handleStopDragging: PropTypes.func,
  zoomLevel: PropTypes.number,
}

export default onClickOutside(DraggableTimeline, clickOutsideConfig)
