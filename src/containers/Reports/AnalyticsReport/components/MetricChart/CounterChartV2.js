/* eslint-disable no-restricted-globals */
import React, { useMemo, useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import first from 'lodash/first'
import get from 'lodash/get'
import map from 'lodash/map'
import max from 'lodash/max'
import forEach from 'lodash/forEach'
import { Group } from '@vx/group'
import { Circle, Line } from '@vx/shape'
import { Grid } from '@vx/grid'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { Point } from '@vx/point'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { localPoint } from '@vx/event'
import { voronoi } from '@vx/voronoi'
import { LegendOrdinal } from '@vx/legend'
import groupBy from 'lodash/groupBy'
import sum from 'lodash/sum'
import moment from 'moment'
import Checkbox from '@material-ui/core/Checkbox'
// src
import { useTheme } from '@material-ui/core/styles'
import propTypes from '../../propTypes/metric'
import {
  getDateTimeForAxis,
  formatTimeForAxis,
  formatTimeForTooltip,
} from '../../utils'

let tooltipTimeout
const chartPropTypes = {
  ...propTypes,
  width: PropTypes.number,
  height: PropTypes.number,
}
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
}
const NUM_TICKS = 10
const DIST_BETWEEN_PTS = 100
const MIN_PTS = 5

const createScaleBand = (xMax, dataPoints) => {
  return scaleBand({
    range: [0, xMax],
    round: true,
    domain: map(dataPoints, 'x'),
    padding: 0.4,
  })
}

const generateYVal = valsOfKey => {
  return (sum(map(valsOfKey, 'y')) / valsOfKey.length).toFixed(2)
}

const retrieveMax = dataset => max(map(dataset, ({ y }) => Number(y)))

function CounterChartV2({ xAxis, yAxes, width, height, breakdown, timezone }) {
  const { palette } = useTheme()
  const [showCurrent, setShowCurrent] = useState(true)
  const [showPrevious, setShowPrevious] = useState(true)
  const margin = { top: 30, bottom: 30, left: 60, right: 30 }

  const yMax = height - margin.top - margin.bottom * 3
  const svgRef = useRef(null)
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  })

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip()

  const yCounter = first(yAxes)

  const dataCounter = useMemo(() => {
    if (!showCurrent) return []
    const keyVals = groupBy(
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value, 'timestamp', timezone),
        y: isNaN(parseFloat(yCounter.values[index]))
          ? 0
          : parseFloat(yCounter.values[index]),
        offset: 0,
        name: yCounter.name || 'Count',
      })),
      'x',
    )

    const vals = []
    forEach(Object.keys(keyVals), key => {
      vals.push({
        x: key,
        y: generateYVal(keyVals[key]),
        offset: 0,
        name: yCounter.name || 'Count',
      })
    })

    return vals
  }, [xAxis, yCounter, showCurrent])

  const xSize = useMemo(() => {
    if (dataCounter && dataCounter.length > MIN_PTS) {
      return dataCounter.length * DIST_BETWEEN_PTS
    }
    if (dataCompare && dataCompare.length > MIN_PTS) {
      return dataCompare.length * DIST_BETWEEN_PTS
    }

    return width
  }, [dataCounter, width, dataCompare])

  const xMax = useMemo(() => {
    return xSize - margin.left - margin.right
  }, [xSize, margin])

  const dataCompare = useMemo(() => {
    if (!yCounter.compare || !showPrevious) return []
    const keyVals = groupBy(
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value, null, timezone),
        y: isNaN(parseFloat(yCounter.compare[index]))
          ? 0
          : parseFloat(yCounter.compare[index]),
        offset: yCounter.offset,
        name: 'Count (Previous)',
      })),
      'x',
    )

    const vals = []
    forEach(Object.keys(keyVals), key => {
      vals.push({
        x: key,
        y: generateYVal(keyVals[key]),
        offset: yCounter.offset,
        name: 'Count (Previous)',
      })
    })
    return vals
  }, [xAxis, yCounter, showPrevious])

  const maxYCompare = retrieveMax(dataCompare)

  const maxYCounter = retrieveMax(dataCounter)

  const xScale = useMemo(() => {
    return dataCounter && dataCounter.length > 0
      ? createScaleBand(xMax, dataCounter)
      : createScaleBand(xMax, dataCompare)
  }, [xMax, dataCounter, dataCompare])
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, max([maxYCompare, maxYCounter]) * 1.2],
        range: [yMax, 0],
        clamp: true,
      }),
    [yMax, maxYCompare, maxYCounter],
  )
  const colorScale = scaleOrdinal({
    domain: ['Current Time Period', 'Past Time Period'],
    range: [palette.primary.main, palette.error.main],
  })
  const voronoiLayout = useMemo(
    () =>
      voronoi({
        x: d => xScale(d.x) + xScale.bandwidth() / 2,
        y: d => yScale(d.y),
        width: xMax,
        height,
      })([...dataCounter, ...dataCompare]),
    [xMax, height, xScale, yScale, dataCounter, dataCompare],
  )

  // event handlers
  const handleMouseMove = useCallback(
    event => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)
      if (!svgRef.current) return

      // find the nearest polygon to the current mouse position
      const point = localPoint(svgRef.current, event)
      if (!point) return
      const neighborRadius = xMax / 2
      const closest = voronoiLayout.find(
        point.x - margin.left,
        point.y - margin.top,
        neighborRadius,
      )
      if (closest) {
        showTooltip({
          tooltipLeft: point.x,
          tooltipTop: point.y,
          tooltipData: closest.data,
        })
      }
    },
    [showTooltip, margin, voronoiLayout, xMax],
  )

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip()
    }, 300)
  }, [hideTooltip])

  const lines = (data, color) => {
    const array = []
    for (let i = 0; i < data.length - 1; i++) {
      const startPoint = new Point({
        x: xScale(data[i].x) + xScale.bandwidth() / 2,
        y: yScale(data[i].y),
      })
      const endPoint = new Point({
        x: xScale(data[i + 1].x) + xScale.bandwidth() / 2,
        y: yScale(data[i + 1].y),
      })
      const line = (
        <Line
          key={`radar-line-${i}`}
          from={startPoint}
          to={endPoint}
          stroke={color}
        />
      )
      array.push(line)
    }
    return array
  }

  const shouldShowTooltip =
    tooltipOpen &&
    (dataCompare.length > 0 || dataCounter.length > 0) &&
    tooltipData

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowX: 'scroll',
      }}
    >
      <svg ref={containerRef} width={xSize} height={height}>
        {/** capture all mouse events with a rect */}
        <rect
          ref={svgRef}
          y={margin.top}
          x={margin.left}
          width={xSize}
          height={yMax}
          rx={14}
          fill='white'
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          stroke={palette.grey[800]}
          strokeOpacity={0.1}
          strokeDasharray={3}
          xOffset={xScale.bandwidth() / 2}
        />
        <Group pointerEvents='none' top={margin.top} left={margin.left}>
          {showCurrent &&
            map(dataCounter, ({ name, x, y }, i) => (
              <Circle
                key={`point-${name}-${i}`}
                className='dot'
                cx={xScale(x) + xScale.bandwidth() / 2}
                cy={yScale(y)}
                r={tooltipData === x ? 7 : 4}
                fill={palette.primary.main}
              />
            ))}
          {showCurrent && lines(dataCounter, palette.primary.main)}
          {showPrevious &&
            map(dataCompare, ({ name, x, y }, i) => (
              <Circle
                key={`point-${name}-${i}`}
                className='dot'
                cx={xScale(x) + xScale.bandwidth() / 2}
                cy={yScale(y)}
                r={tooltipData === x ? 7 : 4}
                fill={palette.error.main}
              />
            ))}
          {showPrevious && lines(dataCompare, palette.error.main)}
        </Group>
        <AxisLeft
          hideTicks
          left={margin.left}
          top={margin.top}
          scale={yScale}
          stroke='transparent'
          tickStroke={palette.grey[700]}
          tickLabelProps={() => ({
            fill: palette.grey[500],
            fontSize: 11,
            textAnchor: 'end',
            dy: '0.33em',
          })}
        />
        <AxisBottom
          hideTicks
          top={yMax + margin.top}
          left={margin.left}
          scale={xScale}
          numTicks={NUM_TICKS}
          tickFormat={d =>
            formatTimeForAxis(moment(d).unix(), breakdown, xAxis.fmt, timezone)
          }
          stroke={palette.grey[500]}
          tickLabelProps={() => ({
            fill: palette.grey[800],
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: margin.bottom / 2 - 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '14px',
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction='row'
          labelMargin='0 15px 0 0'
          shape='circle'
        />

        <Checkbox
          checked={showCurrent}
          onChange={() => setShowCurrent(!showCurrent)}
        />
        <div
          style={{
            marginTop: '10px',
          }}
        >
          Show Current Period
        </div>
        <Checkbox
          checked={showPrevious}
          onChange={() => setShowPrevious(!showPrevious)}
        />
        <div
          style={{
            marginTop: '10px',
          }}
        >
          Show Previous Period
        </div>
      </div>
      {shouldShowTooltip && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>{tooltipData.name}</strong>
          </div>
          <div className='am-caption' style={{ marginTop: 4 }}>
            <div>
              <strong>Date:</strong>{' '}
              {formatTimeForTooltip(
                moment(tooltipData.x).unix() + (tooltipData.offset || 0),
                breakdown,
                xAxis.fmt,
                timezone,
              )}
            </div>
            <div>
              <strong>Count:</strong> {tooltipData.y}
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

const CounterChartV2Wrapper = ({ xAxis, yAxes, breakdown, timezone }) => {
  return (
    <ParentSize>
      {({ width }) => (
        <CounterChartV2
          width={width}
          height={384}
          xAxis={xAxis}
          yAxes={yAxes}
          breakdown={breakdown}
          timezone={timezone}
        />
      )}
    </ParentSize>
  )
}

CounterChartV2.propTypes = chartPropTypes
CounterChartV2Wrapper.propTypes = propTypes

export default CounterChartV2Wrapper
