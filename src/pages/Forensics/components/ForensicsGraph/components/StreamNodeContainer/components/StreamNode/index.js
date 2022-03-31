import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import truncate from 'lodash/truncate'

import useStyles from './styles'

const propTypes = {
  name: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  cxText: PropTypes.number,
  cyText: PropTypes.number,
  handleClick: PropTypes.func,
  handleEnter: PropTypes.func,
  handleLeave: PropTypes.func,
  isHovered: PropTypes.bool,
  isActive: PropTypes.bool,
  fill: PropTypes.string,
  hasResults: PropTypes.bool,
  hasActive: PropTypes.bool,
}

const defaultProps = {
  name: null,
  cx: null,
  cy: null,
  cxText: null,
  cyText: null,
  handleClick: () => {},
  handleEnter: () => {},
  handleLeave: () => {},
  isHovered: false,
  isActive: false,
  fill: '#FFFFFF',
  hasResults: false,
  hasActive: false,
}

const StreamNode = ({
  name,
  cx,
  cy,
  cxText,
  cyText,
  handleClick,
  handleEnter,
  handleLeave,
  isHovered,
  isActive,
  fill,
  hasResults,
  hasActive,
}) => {
  const { palette } = useTheme()
  const classes = useStyles({
    xText: cxText,
    yText: cyText,
    hasResults,
    isActive,
    hasActive,
  })

  return (
    <g
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={fill}
        className={clsx(classes.node, { isHovered })}
      />
      <g>
        <rect
          x={cxText}
          y={cyText - 16}
          width={isHovered ? name.length * 7 : 80}
          height={16}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          // style={{ fill: palette.common.black, cursor: 'pointer' }}
          style={{ fill: palette.background.levels[1], cursor: 'pointer' }}
        />
        <text
          x={cxText}
          y={cyText}
          className={clsx(classes.text, {
            isHovered,
            isActive,
            hasResults,
          })}
          fontSize={12}
        >
          {isHovered || isActive
            ? name
            : truncate(name, {
                length: 14,
                separator: /,? +/,
              })}
        </text>
      </g>
    </g>
  )
}

StreamNode.defaultProps = defaultProps
StreamNode.propTypes = propTypes

export default StreamNode
