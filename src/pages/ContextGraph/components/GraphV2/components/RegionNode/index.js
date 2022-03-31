import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import truncate from 'lodash/truncate'
import { Icon } from 'ambient_ui'

import { regionsSetHovered } from 'redux/contextGraph/actions'

import useStyles from './styles'

function RegionNode({ data, onClick, isHovered, isActive }) {
  const { palette } = useTheme()
  const classes = useStyles({ xText: data.cxText, yText: data.cyText })
  const dispatch = useDispatch()

  const hoveredRegion = useSelector(state => state.contextGraph.hoveredRegion)
  const activeRegion = useSelector(state => state.contextGraph.activeRegion)

  const hoveredAlert = useSelector(state => state.contextGraph.hoveredAlert)
  const activeAlert = useSelector(state => state.contextGraph.activeAlert)

  const handleEnter = () => {
    dispatch(regionsSetHovered(data.id))
  }

  const hasHovered = hoveredRegion || hoveredAlert
  const hasActive = activeRegion || activeAlert

  return (
    <g key={`region-${data.id}`}>
      <circle
        onMouseEnter={handleEnter}
        onMouseLeave={() => dispatch(regionsSetHovered(null))}
        onClick={event => onClick(event, data.id)}
        cx={data.cx}
        cy={data.cy}
        className={clsx(classes.node, {
          isHovered,
          isActive,
          hasHovered,
          hasActive,
        })}
      />
      <g>
        <rect
          id='hoverableUnderText'
          onMouseEnter={handleEnter}
          onMouseLeave={() => dispatch(regionsSetHovered(null))}
          x={data.cxText}
          y={data.cyText}
          width={100}
          height={20}
          className={classes.textContainer}
        />
        <text
          x={data.cxText}
          y={data.cyText}
          className={clsx(classes.text, {
            isHovered,
            isActive,
            hasHovered,
            hasActive,
          })}
        >
          {isHovered || isActive
            ? data.name
            : truncate(data.name, {
                length: 20,
                separator: /,? +/,
              })}
        </text>
        {isHovered || isActive ? (
          <Icon
            icon='compass'
            color={palette.primary[300]}
            size={18}
            x={data.cxText - 22}
            y={data.cyText - 14}
          />
        ) : null}
      </g>
    </g>
  )
}

RegionNode.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  isHovered: PropTypes.bool,
}

export default RegionNode
