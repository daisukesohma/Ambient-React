import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import truncate from 'lodash/truncate'
import { regionsSetHovered } from 'redux/forensics/actions'

import BadgeResults from './components/BadgeResults'
import useStyles from './styles'

const propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  centerX: PropTypes.number,
  centerY: PropTypes.number,
  data: PropTypes.object,
  isActive: PropTypes.bool,
  isSelected: PropTypes.bool,
  isHovered: PropTypes.bool,
  onClick: PropTypes.func,
  hasSelected: PropTypes.bool,
  setStreamSelectorAnchor: PropTypes.func,
}

const defaultProps = {
  cx: null,
  cy: null,
  centerX: null,
  centerY: null,
  data: {},
  isActive: false,
  isSelected: false,
  isHovered: false,
  hasSelected: false,
  onClick: () => {},
}

function RegionNode({
  data,
  onClick,
  isHovered,
  isActive,
  hasSelected,
  cx,
  cy,
  centerX,
  centerY,
  isSelected,
}) {
  const dispatch = useDispatch()
  const [hasResults, setHasResults] = useState(false)
  const hoveredRegion = useSelector(state => state.forensics.hoveredRegion)
  const activeRegions = useSelector(state => state.forensics.activeRegions)
  const allStreamsByRegion = useSelector(
    state => state.forensics.streamsByRegion,
  )

  const regionId = data.id
  const streamsByRegion = allStreamsByRegion[regionId]
  const hasActive = activeRegions && activeRegions.length > 0

  const classes = useStyles({
    xText: data.cxText,
    yText: data.cyText,
    hasResults,
    isActive,
    hasActive,
    isSelected,
    hasSelected,
    centerX,
    centerY,
    cx,
    cy,
    cxMultiplier: data.cxMultiplier,
    cyMultiplier: data.cyMultiplier,
  })

  const isResultsEmpty = data.resultCount === 0

  const handleEnter = () => {
    dispatch(regionsSetHovered(regionId))
  }

  useEffect(() => {
    setHasResults(data.resultCount >= 0)
  }, [data])

  // middle is for text on top of the circle
  // start is for text on the right side
  // end is for text on the left side of the circle
  //
  const getTextAnchorFromDegree = degree => {
    const topBottomMargin = 15
    if (degree > 90 - topBottomMargin && degree < 90 + topBottomMargin) {
      return 'middle'
    }
    if (degree > 270 - topBottomMargin && degree < 270 + topBottomMargin) {
      return 'middle'
    }
    if (degree > 270) {
      return 'start'
    }
    if (degree > 180) {
      return 'end'
    }
    if (degree > 90) {
      return 'end'
    }
    return 'start'
  }

  const hoverableWidth = 120
  const getHoverableX = () => {
    const x = data.cxText
    const degree = data.angleDegree
    const width = 120
    const topBottomMargin = 15
    if (degree > 90 - topBottomMargin && degree < 90 + topBottomMargin) {
      return x - width / 2
    }
    if (degree > 270 - topBottomMargin && degree < 270 + topBottomMargin) {
      return x - width / 2
    }
    if (degree > 270) {
      return x
    }
    if (degree > 180) {
      return x - width
    }
    if (degree > 90) {
      return x - width
    }
    return x
  }

  return (
    <g key={`region-${regionId}`}>
      <circle
        onMouseEnter={handleEnter}
        onMouseLeave={() => dispatch(regionsSetHovered(null))}
        onClick={event => onClick(event, data)}
        cx={cx}
        cy={cy}
        className={clsx(classes.node, {
          isHovered,
          isActive,
          hasHovered: hoveredRegion,
          hasActive,
          hasResults,
          isResultsEmpty,
          isSelected,
        })}
      />
      <g>
        <rect
          id='hoverableUnderText'
          onMouseEnter={handleEnter}
          onMouseLeave={() => dispatch(regionsSetHovered(null))}
          x={getHoverableX()}
          y={data.cyText}
          width={hoverableWidth}
          height={20}
          className={classes.textContainer}
        />

        <text
          x={data.cxText}
          y={data.cyText}
          className={clsx(classes.text, {
            isHovered,
            isActive,
            hasHovered: hoveredRegion,
            hasActive,
            hasResults,
            isResultsEmpty,
            isSelected,
          })}
          fontSize={isSelected ? 16 : 12}
          textAnchor={getTextAnchorFromDegree(data.angleDegree)}
        >
          {isHovered || isActive
            ? data.name
            : truncate(data.name, {
                length: 14,
                separator: /,? +/,
              })}
        </text>
        {/* ACTIVE and STREAM COUNT  {data.resultCount} */}
        {streamsByRegion && (
          <g>
            <BadgeResults
              x={cx}
              y={cy}
              centerX={centerX}
              centerY={centerY}
              cxMultiplier={data.cxMultiplier}
              cyMultiplier={data.cyMultiplier}
              hasSelected={hasSelected}
              hasResults={hasResults}
              count={data.resultCount}
              isActive={isActive}
              isSelected={isSelected}
            />

            <text
              x={data.cxText}
              y={data.cyText + 14}
              fontSize={isSelected ? 14 : 10}
              className={clsx(classes.streamCountText, {
                isResultsEmpty,
              })}
              textAnchor={getTextAnchorFromDegree(data.angleDegree)}
            >
              {streamsByRegion.filter(s => s.active).length ===
              streamsByRegion.length
                ? `${streamsByRegion.length} streams`
                : `${streamsByRegion.filter(s => s.active).length}/${
                    streamsByRegion.length
                  } streams`}
            </text>
          </g>
        )}
      </g>
    </g>
  )
}

RegionNode.propTypes = propTypes

RegionNode.defaultProps = defaultProps

export default RegionNode
