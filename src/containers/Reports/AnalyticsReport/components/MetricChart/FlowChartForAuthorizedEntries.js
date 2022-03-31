/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
// React
import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { localPoint } from '@vx/event'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { curveLinear } from '@vx/curve'
import { Grid } from '@vx/grid'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { Line, LinePath, Bar } from '@vx/shape'
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { LegendOrdinal } from '@vx/legend'
import moment from 'moment'
import max from 'lodash/max'
import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import findIndex from 'lodash/findIndex'
import { useTheme } from '@material-ui/core/styles'
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

function FlowChartForAuthorizedEntries({
  width,
  height,
  xAxis,
  yAxes,
  breakdown,
  darkMode = false,
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

  const yPercentage = useMemo(
    () => find(yAxes, { key: 'percentage_compliant' }),
    [yAxes],
  )

  const dataCompare = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value), // date
        y: parseFloat(yPercentage.compare[index]),
        name: 'Previous',
      })),
    [xAxis, yPercentage],
  )

  const dataCurrent = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: getDateTimeForAxis(value), // date
        y: parseFloat(yPercentage.values[index]),
        name: 'Current',
      })),
    [xAxis, yPercentage],
  )

  const xSize = dataCompare.length > 5 ? dataCompare.length * 100 : width
  const xMax = xSize - margin.left - margin.right

  const lineY = useMemo(
    () => map(dataCompare, 'y').concat(map(dataCurrent, 'y')),
    [dataCompare, dataCurrent],
  )
  const lineMaxima = useMemo(() => max(map(lineY, v => Math.abs(v))), [lineY])

  // scales
  const dateArr = map(dataCompare, 'x')
  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: dateArr,
    padding: 0.4,
  })
  const lineYScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, lineMaxima],
  })
  const colorScale = scaleOrdinal({
    domain: ['Current', 'Previous'],
    range: colorRange,
  })

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
      const compareD = getD(x - margin.left, dataCompare)
      const currentD = getD(x - margin.left, dataCurrent)

      if (compareD && currentD) {
        showTooltip({
          tooltipData: { compareD, currentD },
          tooltipLeft: x,
          tooltipTop: y,
        })
      }
    },
    [showTooltip, getD, dataCompare, dataCurrent, margin],
  )

  const formatTooltipData = d => {
    const timeSeconds = d.x._isAMomentObject
      ? d.x.seconds()
      : d.x.getTime() / 1000

    const date = formatTimeForTooltip(timeSeconds + (d.offset || 0), breakdown)
    return `${date}, ${d.name}: ${d.y.toFixed(2)}%`
  }

  const axisBottomTop = isNaN(lineYScale(0))
    ? margin.top
    : margin.top + lineYScale(0)

  return width < 10 ? null : (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowX: 'scroll',
        textAlign: 'center',
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
          yScale={lineYScale}
          width={xMax}
          height={yMax}
          stroke={darkMode ? 'white' : 'black'}
          strokeOpacity={0.2}
          strokeDasharray='1,3'
          pointerEvents='none'
          xOffset={xScale.bandwidth() / 2}
        />
        <LinePath
          curve={curveLinear}
          data={dataCurrent}
          x={d => xScale(d.x) || 0}
          y={d => margin.top + lineYScale(d.y) || 0}
          stroke={colorRange[0]}
          strokeWidth={2}
          strokeOpacity={1}
          shapeRendering='geometricPrecision'
        />
        <LinePath
          curve={curveLinear}
          data={dataCompare}
          x={d => xScale(d.x) || 0}
          y={d => margin.top + lineYScale(d.y) || 0}
          stroke={colorRange[1]}
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
        {tooltipOpen && dataCompare.length > 0 && tooltipData && (
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
          tickFormat={d => formatTimeForAxis(moment(d).unix(), breakdown)}
          tickStroke={colorRange[0]}
          numTicks={NUM_TICKS}
          tickLabelProps={() => ({
            fill: palette.grey[800],
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        {tooltipOpen && dataCompare.length > 0 && tooltipData && (
          <TooltipInPortal
            key={Math.random()} // update tooltip bounds each render
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            {formatTooltipData(get(tooltipData, 'compareD'))}
            <br />
            {formatTooltipData(get(tooltipData, 'currentD'))}
            <br />
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

function FlowChartForAuthorizedEntriesWrapper({ xAxis, yAxes, breakdown }) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <FlowChartForAuthorizedEntries
          width={width}
          height={height}
          xAxis={xAxis}
          yAxes={yAxes}
          breakdown={breakdown}
        />
      )}
    </ParentSize>
  )
}

FlowChartForAuthorizedEntries.propTypes = chartPropTypes
FlowChartForAuthorizedEntriesWrapper.propTypes = propTypes

export default FlowChartForAuthorizedEntriesWrapper
