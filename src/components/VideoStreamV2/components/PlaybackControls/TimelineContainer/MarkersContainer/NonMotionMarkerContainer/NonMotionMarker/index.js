import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import {
  EXPANDED_TIMELINE_HEIGHT,
  THIN_TIMELINE_HEIGHT,
} from '../../../MainTimeline/constants'
import './index.css'

const NonMotionMarker = ({ isHoveringOnTimeline, width, x }) => {
  const { palette } = useTheme()
  const yOffset = -1
  const heightDiff = EXPANDED_TIMELINE_HEIGHT - THIN_TIMELINE_HEIGHT
  const yTranslate = isHoveringOnTimeline ? -heightDiff : yOffset
  return (
    <rect
      className={`datapoint nonmotion ${
        isHoveringOnTimeline ? 'hovering' : ''
      }`}
      rx='3'
      fill={palette.grey[500]}
      height={THIN_TIMELINE_HEIGHT}
      width={`${width}`}
      x='-1'
      transform={`translate(${x}, ${yTranslate})`}
    />
  )
}

NonMotionMarker.defaultProps = {
  isHoveringOnTimeline: false,
  width: 0,
  x: 0,
}

NonMotionMarker.propTypes = {
  isHoveringOnTimeline: PropTypes.bool,
  width: PropTypes.number,
  x: PropTypes.number,
}

export default NonMotionMarker
