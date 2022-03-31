import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { connect } from 'react-redux'
import get from 'lodash/get'

import {
  VmsPropType,
  VmsPropTypeDefault,
} from '../../../../../../common/data/proptypes'

import ClickableTimeline from './ClickableTimeline'
import DraggableTimeline from './DraggableTimeline'
import Hoverline from './Hoverline'
import HoverPlay from './HoverPlay'
import Playhead from './Playhead' // playpointer
import TimelineBackground from './TimelineBackground'
import TimeIncrementMarkersContainer from './TimeIncrementMarkersContainer'
import EdgesOverlay from './EdgesOverlay'
import { HEADROOM_HEIGHT, TOTAL_HEIGHT } from './constants'

import './index.css'

const MainTimeline = ({
  alertMarkers,
  clipControl,
  darkMode,
  hoverIndicatorX,
  isHoveringOnTimeline,
  isHoveringOnTimelineContainer,
  isHoveringOnDraggableTimeline,
  isHoveringOnTopControls,
  markers,
  mouseIndicatorX,
  moveViewBoxLeft,
  moveViewBoxRight,
  onDraggableTimeline,
  onDraggableTimelineHover,
  onDraggableTimelineHoverOff,
  onMouseLeave,
  onMouseDown,
  onTimelineHover,
  playpointerPosition,
  position,
  handleStopDragging,
  streamId,
  svgRef,
  svgWidth,
  timelineContainer,
  timelineWidth,
  viewWindowPosition,
  videoStreamTS,
  vms,
  waiting,
  windowOffset,
  zoomLevel,
}) => {
  const [isHoveringOnEdges, setIsHoveringOnEdges] = useState(false)

  const isHoveringOnVideo = get(
    vms,
    `timeline.custom[${streamId}].isHoveringOnVideo`,
  )
  const isHoveringOnControls =
    isHoveringOnTimeline ||
    isHoveringOnDraggableTimeline ||
    isHoveringOnEdges ||
    isHoveringOnTopControls

  const isTimelineVisible =
    position === 'below' ||
    isHoveringOnVideo ||
    isHoveringOnTimelineContainer ||
    isHoveringOnControls

  const svgClass = clsx(
    'svg-container',
    { darkMode },
    { overlay: position === 'overlay' },
    { visible: isTimelineVisible },
  )

  const mainTimelineContainerX = viewWindowPosition + windowOffset

  return (
    <svg ref={svgRef} height={TOTAL_HEIGHT} className={svgClass}>
      <rect
        className='headroom'
        height={HEADROOM_HEIGHT}
        fill='transparent'
        width='100%'
      />
      <g
        id='timeline-main-container'
        transform={`translate(${mainTimelineContainerX}, ${HEADROOM_HEIGHT})`}
      >
        <TimelineBackground timelineWidth={timelineWidth} />
        <TimeIncrementMarkersContainer
          viewWindowPosition={viewWindowPosition}
          svgWidth={svgWidth}
          vms={vms}
          zoomLevel={zoomLevel}
        />
        {markers}
        <Hoverline
          hoverIndicatorX={hoverIndicatorX}
          isHoveringOnTimeline={isHoveringOnTimeline}
          type='ball'
          windowOffset={windowOffset}
        />
        <ClickableTimeline
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onTimelineHover={onTimelineHover}
          timelineContainer={timelineContainer}
          timelineWidth={timelineWidth}
          waiting={waiting}
        />
        <Playhead
          showPlayheadLine={false}
          showPlayheadBall
          playpointerPosition={playpointerPosition}
          videoStreamTS={videoStreamTS}
        />
        <DraggableTimeline
          onDrag={onDraggableTimeline}
          handleStopDragging={handleStopDragging}
          onDraggableTimelineHover={onDraggableTimelineHover}
          onDraggableTimelineHoverOff={onDraggableTimelineHoverOff}
          zoomLevel={zoomLevel}
          eventTypes={['mouseup']}
          disableOnClickOutside={false}
        />
        <g className='datapoints alerts'>{alertMarkers}</g>
        {clipControl}
      </g>
      {false && (
        <HoverPlay
          isHoveringOnTimeline={isHoveringOnTimeline}
          svgWidth={svgWidth}
          windowOffset={windowOffset}
          mouseIndicatorX={mouseIndicatorX}
        />
      )}
      {isHoveringOnControls && (
        <EdgesOverlay
          moveViewBoxLeft={moveViewBoxLeft}
          moveViewBoxRight={moveViewBoxRight}
          svgWidth={svgWidth}
          onHoverEnter={() => setIsHoveringOnEdges(true)}
          onHoverLeave={() => setIsHoveringOnEdges(false)}
        />
      )}
    </svg>
  )
}

MainTimeline.defaultProps = {
  alertMarkers: null,
  clipControl: null,
  darkMode: false,
  hoverIndicatorX: 0,
  isHoveringOnDraggableTimeline: false,
  isHoveringOnTimeline: false,
  isHoveringOnTimelineContainer: false,
  isHoveringOnTopControls: false,
  markers: null,
  mouseIndicatorX: 0,
  moveViewBoxLeft: () => {},
  moveViewBoxRight: () => {},
  onDraggableTimeline: () => {},
  onDraggableTimelineHover: () => {},
  onDraggableTimelineHoverOff: () => {},
  onMouseLeave: () => {},
  onMouseDown: () => {},
  onTimelineHover: () => {},
  playpointerPosition: 0,
  position: 'below',
  handleStopDragging: () => {},
  streamId: null,
  svgRef: null,
  timelineContainer: null,
  timelineWidth: 0,
  viewWindowPosition: 0,
  waiting: null,
  windowOffset: 0,
  svgWidth: 0,
  videoStreamTS: null,
  vms: VmsPropTypeDefault,
  zoomLevel: 5,
}

MainTimeline.propTypes = {
  alertMarkers: PropTypes.node,
  clipControl: PropTypes.node,
  darkMode: PropTypes.bool,
  hoverIndicatorX: PropTypes.number,
  isHoveringOnDraggableTimeline: PropTypes.bool,
  isHoveringOnTimeline: PropTypes.bool,
  isHoveringOnTimelineContainer: PropTypes.bool,
  isHoveringOnTopControls: PropTypes.bool,
  markers: PropTypes.node,
  mouseIndicatorX: PropTypes.number,
  moveViewBoxLeft: PropTypes.func,
  moveViewBoxRight: PropTypes.func,
  onDraggableTimeline: PropTypes.func,
  onDraggableTimelineHover: PropTypes.func,
  onDraggableTimelineHoverOff: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onTimelineHover: PropTypes.func,
  playpointerPosition: PropTypes.number,
  position: PropTypes.oneOf(['overlay', 'below']),
  handleStopDragging: PropTypes.func,
  streamId: PropTypes.number,
  svgRef: PropTypes.element,
  svgWidth: PropTypes.number,
  timelineContainer: PropTypes.element,
  timelineWidth: PropTypes.number,
  viewWindowPosition: PropTypes.number,
  waiting: PropTypes.string,
  windowOffset: PropTypes.number,
  videoStreamTS: PropTypes.number,
  vms: VmsPropType,
  zoomLevel: PropTypes.number,
}

const mapStateToProps = state => ({
  vms: state.vms,
})

export default connect(
  mapStateToProps,
  null,
)(MainTimeline)
