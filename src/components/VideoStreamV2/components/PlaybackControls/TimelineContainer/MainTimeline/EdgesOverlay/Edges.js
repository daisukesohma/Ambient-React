import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { IconContext } from 'react-icons'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import { EDGE_WIDTH, EDGE_EXPAND_WIDTH, TOTAL_HEIGHT } from '../constants'

// FUTURE: @ERIC Can make this edgeIcon and EdgeHandle components in order to separate out its positioning logic from each other.
const ICON_SMALL = 24
const ICON_LARGE = 32
const ICON_DIFFERENCE = ICON_LARGE - ICON_SMALL

const Edges = ({
  darkMode,
  moveViewBoxLeft,
  moveViewBoxRight,
  onHoverEnter,
  onHoverLeave,
  position,
  svgWidth,
}) => {
  const { palette } = useTheme()
  const [isHovering, setIsHovering] = useState(false)
  const [iconWidth, setIconWidth] = useState(ICON_SMALL)
  const startingRightEdgeX = svgWidth - EDGE_WIDTH

  // account for difference in icon size for the y translation so center of icon doesn't move
  const iconTranslateY = !isHovering
    ? TOTAL_HEIGHT / 2
    : (TOTAL_HEIGHT - ICON_DIFFERENCE) / 2

  const getIconColor = () => {
    if (position === 'overlay') {
      return palette.common.white
    }
    if (darkMode) {
      return isHovering ? palette.common.white : palette.grey[400]
    }
    return isHovering ? palette.grey[900] : palette.grey[700]
  }

  /* eslint-disable react/prop-types */
  const Icon = props => (
    <IconContext.Provider
      value={{
        color: getIconColor(),
        size: iconWidth,
        className: 'arrow',
        style: { verticalAlign: 'center' },
      }}
    >
      {props.children}
    </IconContext.Provider>
  )
  /* eslint-enable react/prop-types */

  const LeftArrow = () => {
    return (
      <Icon>
        <FiChevronLeft />
      </Icon>
    )
  }

  const RightArrow = () => {
    return (
      <Icon>
        <FiChevronRight />
      </Icon>
    )
  }

  // Mouse events
  const onMouseEnter = e => {
    setIsHovering(true)
    onHoverEnter()
    setIconWidth(ICON_LARGE)
    expandEdgeWidth(e)
  }

  const onMouseLeave = e => {
    setIsHovering(false)
    onHoverLeave()
    setIconWidth(ICON_SMALL)
    resetEdge(e)
  }

  let expandEdgeWidth = e => {
    e.target.setAttribute('width', EDGE_WIDTH + EDGE_EXPAND_WIDTH)
  }

  let resetEdge = e => {
    e.target.setAttribute('width', EDGE_WIDTH)
  }

  return (
    <>
      <rect
        className='timeline-edge'
        width={EDGE_WIDTH}
        height={TOTAL_HEIGHT}
        fill='url("#leftEdge")'
        onMouseDown={moveViewBoxLeft}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <rect
        className='timeline-edge'
        width={EDGE_WIDTH}
        height={TOTAL_HEIGHT}
        fill='url("#rightEdge")'
        transform={`translate(${startingRightEdgeX})`}
        onMouseDown={moveViewBoxRight}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <g
        transform={`translate(0, ${iconTranslateY})`}
        onMouseDown={moveViewBoxLeft}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <LeftArrow />
      </g>
      <g
        transform={`translate(${svgWidth - iconWidth}, ${iconTranslateY})`}
        onMouseDown={moveViewBoxRight}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <RightArrow />
      </g>
    </>
  )
}

Edges.defaultProps = {
  darkMode: false,
  onHoverEnter: () => {},
  onHoverLeave: () => {},
  position: 'below',
  moveViewBoxLeft: () => {},
  moveViewBoxRight: () => {},
  svgWidth: 0,
}
Edges.propTypes = {
  darkMode: PropTypes.bool,
  onHoverEnter: PropTypes.func,
  onHoverLeave: PropTypes.func,
  position: PropTypes.oneOf(['below', 'overlay']),
  moveViewBoxLeft: PropTypes.func,
  moveViewBoxRight: PropTypes.func,
  svgWidth: PropTypes.number,
}
export default Edges
