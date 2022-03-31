import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import moment from 'moment'

import { THIN_TIMELINE_HEIGHT } from '../MainTimeline/constants'

import ClipTimeDisplay from './ClipTimeDisplay'

const SIDE_CORNER_RADIUS = 4
const SIDE_WIDTH = 13 - SIDE_CORNER_RADIUS
const SIDE_OVERHANG = 7
const SIDE_HEIGHT =
  THIN_TIMELINE_HEIGHT + 2 * SIDE_OVERHANG - SIDE_CORNER_RADIUS // 4 + 2*7 = 18
const Y_OFFSET = 2 * SIDE_CORNER_RADIUS
const HALF_POINT_Y = THIN_TIMELINE_HEIGHT / 2 + SIDE_OVERHANG
const SIDE_CENTER_Y = Y_OFFSET - HALF_POINT_Y
const FLOOR_HEIGHT = 1

// Custom svg path for one-sided curved side handle
// https://medium.com/@dennismphil/one-side-rounded-rectangle-using-svg-fb31cf318d90

// FUTURE: @eric maintain internal clip left and right position, then send to parent component when exporting
// could keep clipLeftPosition and clipRightPosition here instead of passing up and back down.
const ClipControl = ({
  clipLeftPosition,
  clipLeftPositionTS,
  clipRightPosition,
  clipRightPositionTS,
  clipWidth,
  initClipControlsPosition,
  startDrag,
}) => {
  const { palette } = useTheme()
  const [isHovering, setIsHovering] = useState(false)

  const leftTime = clipLeftPositionTS
    ? moment.unix(clipLeftPositionTS).format('HH:mm:ss')
    : undefined
  const rightTime = clipRightPositionTS
    ? moment.unix(clipRightPositionTS).format('HH:mm:ss')
    : undefined

  return (
    <g
      className='clip'
      transform={`translate(${initClipControlsPosition}, 0)`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <g className='clip-selector'>
        <g transform={`translate(${clipLeftPosition}, -${HALF_POINT_Y})`}>
          <rect
            className='clip-floor-top selection'
            height={FLOOR_HEIGHT}
            fill={palette.warning.main}
            width={`${clipWidth}`}
          />
          <rect
            className='clip-floor-bottom selection'
            y={SIDE_HEIGHT + SIDE_CORNER_RADIUS * 2 - FLOOR_HEIGHT}
            height={FLOOR_HEIGHT}
            fill={palette.warning.main}
            width={`${clipWidth}`}
          />
        </g>
        <g
          className='left'
          transform={`translate(${clipLeftPosition -
            SIDE_WIDTH}, ${SIDE_CENTER_Y})`}
        >
          <path
            id='clipLeftPosition'
            onMouseDown={startDrag}
            className='handle draggable'
            d={`M${SIDE_WIDTH},0
                v${SIDE_HEIGHT}
                h${-SIDE_WIDTH}
                q${-SIDE_CORNER_RADIUS},0 ${-SIDE_CORNER_RADIUS},${-SIDE_CORNER_RADIUS}
                v${-SIDE_HEIGHT}
                q0,${-SIDE_CORNER_RADIUS} ${SIDE_CORNER_RADIUS},${-SIDE_CORNER_RADIUS}
                h${SIDE_WIDTH}
                z
              `}
            fill={palette.warning.main}
          />
          {isHovering && leftTime && <ClipTimeDisplay time={leftTime} />}
        </g>
        <g
          className='right'
          transform={`translate(${clipRightPosition}, ${-HALF_POINT_Y})`}
        >
          <path
            id='clipRightPosition'
            onMouseDown={startDrag}
            className='handle draggable'
            d={`M0,0
                h${SIDE_WIDTH}
                q${SIDE_CORNER_RADIUS},0 ${SIDE_CORNER_RADIUS},${SIDE_CORNER_RADIUS}
                v${SIDE_HEIGHT}
                q0,${SIDE_CORNER_RADIUS} ${-SIDE_CORNER_RADIUS},${SIDE_CORNER_RADIUS}
                h${-SIDE_WIDTH}
                v${-SIDE_HEIGHT}
                z
              `}
            fill={palette.warning.main}
          />
          <g transform={`translate(0, ${HALF_POINT_Y})`}>
            {isHovering && rightTime && <ClipTimeDisplay time={rightTime} />}
          </g>
        </g>
      </g>
    </g>
  )
}
ClipControl.defaultProps = {
  clipLeftPosition: 0,
  clipLeftPositionTS: 0,
  clipRightPosition: 0,
  clipRightPositionTS: 0,
  clipWidth: 0,
  initClipControlsPosition: 0,
  startDrag: () => {},
}

ClipControl.propTypes = {
  clipLeftPosition: PropTypes.number,
  clipLeftPositionTS: PropTypes.number,
  clipRightPosition: PropTypes.number,
  clipRightPositionTS: PropTypes.number,
  clipWidth: PropTypes.number,
  initClipControlsPosition: PropTypes.number,
  startDrag: PropTypes.func,
}

export default ClipControl
