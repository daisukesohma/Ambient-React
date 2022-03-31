/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { localPoint } from '@vx/event'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { curveLinear } from '@vx/curve'
import { Group } from '@vx/group'
import { Grid } from '@vx/grid'
import { AxisBottom, AxisLeft, AxisRight } from '@vx/axis'
import { Line, LinePath, Bar } from '@vx/shape'
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { LegendOrdinal } from '@vx/legend'
import moment from 'moment'
import max from 'lodash/max'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import map from 'lodash/map'
// src

import propTypes from '../../propTypes/chart'
import {
  formatTimeForAxis,
  formatTimeForTooltip,
  getDateTimeForAxis,
} from '../../utils'

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

const NUM_TICKS = 5

function FlowChartV2({
  width,
  height,
  xAxis,
  yAxes,
  breakdown,
  darkMode = false,
  timezone,
}) {
  const { palette } = useTheme()
  const colorRange = [palette.primary.main, palette.error.main]
  const margin = { top: 30, right: 30, bottom: 30, left: 30 }
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
  // bounds
  const yMax = height - margin.top - margin.bottom * 2

  const yEnters = useMemo(() => find(yAxes, { key: 'enters' }), [yAxes])
  const yExits = useMemo(() => find(yAxes, { key: 'exits' }), [yAxes])
  const yNet = useMemo(() => find(yAxes, { key: 'net' }), [yAxes])
  const yCumOcc = useMemo(() => find(yAxes, { key: 'cumulative' }), [yAxes])

  const dataEnters = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value, null, timezone), // date
        y: parseFloat(yEnters.values[index]),
        name: yEnters.name,
      })),
    [xAxis, yEnters],
  )

  const dataExits = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value, null, timezone),
        y: -1 * parseFloat(yExits.values[index]),
        name: yExits.name,
      })),
    [xAxis, yExits],
  )

  const dataNet = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value, null, timezone),
        y: parseFloat(yNet.values[index]),
        name: yNet.name,
      })),
    [xAxis, yNet],
  )

  const dataCumOcc = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value, null, timezone),
        y: parseFloat(yCumOcc.values[index]),
        name: yCumOcc.name,
      })),
    [xAxis, yCumOcc],
  )

  const xSize = dataEnters.length > 5 ? dataEnters.length * 100 : width
  const xMax = xSize - margin.left - margin.right

  const barY = useMemo(() => map(dataEnters, 'y').concat(map(dataExits, 'y')), [
    dataEnters,
    dataExits,
  ])
  const lineY = useMemo(() => map(dataNet, 'y').concat(map(dataCumOcc, 'y')), [
    dataNet,
    dataCumOcc,
  ])
  const barMaxima = useMemo(() => max(map(barY, v => Math.abs(v))), [barY])
  const lineMaxima = useMemo(() => max(map(lineY, v => Math.abs(v))), [lineY])

  // scales
  const dateArr = map(dataEnters, 'x')
  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: dateArr,
    padding: 0.4,
  })
  const barYScale = scaleLinear({
    range: [yMax, 0],
    domain: [-barMaxima, barMaxima],
  })
  const lineYScale = scaleLinear({
    range: [yMax, 0],
    domain: [-lineMaxima, lineMaxima],
  })
  const colorScale = scaleOrdinal({
    domain: ['Enter', 'Exit'],
    range: colorRange,
  })

  const barSeries = [dataEnters, dataExits]

  // Tooltip
  const getD = useCallback(
    (x, lineData) => {
      // find first date
      const index = findIndex(
        dateArr,
        date => xScale(date) <= x && x <= xScale(date) + xScale.bandwidth(),
      )
      return lineData[index]
    },
    [xScale, dateArr],
  )

  const handleTooltip = useCallback(
    event => {
      const coords = localPoint(event) || { x: 0, y: 0 }
      const { x, y } = coords
      const enterD = getD(x - margin.left, dataEnters)
      const exitD = getD(x - margin.left, dataExits)
      const netD = getD(x - margin.left, dataNet)
      if (enterD && exitD && netD) {
        showTooltip({
          tooltipData: { enterD, exitD, netD },
          tooltipLeft: x,
          tooltipTop: y,
        })
      }
    },
    [showTooltip, getD, dataEnters, dataExits, dataNet, margin],
  )

  const formatTooltipData = (d, isNegative) => {
    const sign = isNegative ? -1 : 1
    const date = formatTimeForTooltip(
      d.x.getTime() / 1000 + (d.offset || 0),
      breakdown,
      null,
      timezone,
    )
    return `${date}, ${d.name}: ${d.y.toFixed(2) * sign}`
  }

  const axisBottomTop = isNaN(barYScale(0))
    ? margin.top
    : margin.top + barYScale(0)

  return width < 10 ? null : (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowX: 'scroll',
      }}
    >
      <svg ref={containerRef} width={xSize} height={height}>
        <rect
          width={xMax}
          height={height}
          fill='white'
          rx={14}
          ry={14}
          y={margin.top}
          x={margin.left}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={xScale}
          yScale={barYScale}
          width={xMax}
          height={yMax}
          stroke={darkMode ? 'white' : 'black'}
          strokeOpacity={0.2}
          strokeDasharray='1,3'
          pointerEvents='none'
          xOffset={xScale.bandwidth() / 2}
        />
        {map(barSeries, (barData, i) => {
          return (
            <Group key={`bars-${i}`} top={margin.top} left={margin.left}>
              {map(barData, d => {
                const currentDate = d.x
                const barWidth = xScale.bandwidth()
                const x = xScale(currentDate)
                const y = d.y > 0 ? barYScale(d.y) : barYScale(0)
                const barHeight = Math.abs(barYScale(0) - barYScale(d.y))
                return (
                  <Bar
                    key={`bar-${currentDate}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={colorRange[i]}
                    opacity={0.5}
                  />
                )
              })}
            </Group>
          )
        })}
        <LinePath
          curve={curveLinear}
          data={dataNet}
          x={d => xScale(d.x) || 0}
          y={d => margin.top + lineYScale(d.y) || 0}
          stroke={colorRange[0]}
          strokeWidth={2}
          strokeOpacity={1}
          shapeRendering='geometricPrecision'
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={xMax}
          height={yMax}
          fill='transparent'
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipOpen && dataEnters.length > 0 && tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: yMax + margin.top }}
              stroke={palette.secondary.main}
              strokeWidth={2}
              pointerEvents='none'
              strokeDasharray='5,2'
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill='black'
              fillOpacity={0.1}
              stroke='black'
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents='none'
            />
          </g>
        )}
        <AxisLeft
          left={margin.left}
          top={margin.top}
          scale={barYScale}
          hideTicks
          stroke='transparent'
          tickStroke={palette.grey[700]}
          numTicks={NUM_TICKS}
          tickLabelProps={() => ({
            fill: palette.grey[500],
            fontSize: 11,
            textAnchor: 'middle',
          })}
          tickFormat={d => d}
        />
        <AxisRight
          left={xMax}
          tickTextFill={colorRange[0]}
          top={margin.top}
          scale={lineYScale}
          hideTicks
          stroke='transparent'
          tickStroke={palette.grey[700]}
          numTicks={NUM_TICKS}
          tickLabelProps={() => ({
            fill: palette.grey[500],
            fontSize: 11,
            textAnchor: 'middle',
          })}
          tickFormat={d => d}
        />
        <AxisBottom
          left={margin.left}
          top={axisBottomTop}
          scale={xScale}
          hideTicks
          stroke={palette.grey[500]}
          tickFormat={d => {
            return formatTimeForAxis(
              moment(d).unix(),
              breakdown,
              null,
              timezone,
            )
          }}
          tickStroke={colorRange[0]}
          numTicks={NUM_TICKS}
          tickLabelProps={() => ({
            fill: palette.grey[800],
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        {tooltipOpen && dataEnters.length > 0 && tooltipData && (
          <TooltipInPortal
            key={Math.random()} // update tooltip bounds each render
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            {formatTooltipData(get(tooltipData, 'enterD'))}
            <br />
            {formatTooltipData(get(tooltipData, 'exitD'), true)}
            <br />
            {formatTooltipData(get(tooltipData, 'netD'))}
          </TooltipInPortal>
        )}
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
      </div>
    </div>
  )
}

function FlowChartV2Wrapper({ xAxis, yAxes, breakdown, timezone }) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <FlowChartV2
          width={width}
          height={height}
          xAxis={xAxis}
          yAxes={yAxes}
          breakdown={breakdown}
          timezone={timezone}
        />
      )}
    </ParentSize>
  )
}

FlowChartV2.propTypes = chartPropTypes
FlowChartV2Wrapper.propTypes = propTypes

export default FlowChartV2Wrapper
