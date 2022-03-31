import React, { useCallback, useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import MGrid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import { extent, max, bisector } from 'd3-array'
import { localPoint } from '@vx/event'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { curveLinear } from '@vx/curve'
import { Group } from '@vx/group'
import { Grid } from '@vx/grid'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { Line, LinePath, Bar } from '@vx/shape'
import { scaleTime, scaleLinear, scaleOrdinal } from '@vx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { LegendOrdinal } from '@vx/legend'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'
// src
import propTypes from '../../propTypes/chart'
import {
  formatTimeForTooltip,
  getDateTimeForAxis,
  formatTimeForAxis,
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
function OccupancyChartV2({
  darkMode,
  width,
  height,
  xAxis,
  yAxes,
  breakdown,
  threshold,
  timezone,
}) {
  const { palette } = useTheme()
  const colorRange = [
    palette.primary.main,
    palette.error.light,
    palette.error.main,
  ]
  const NUM_TICKS = 5
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

  const yOcc = useMemo(() => find(yAxes, { key: 'occupancy' }), [yAxes])

  const dataOcc = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        date: getDateTimeForAxis(value, null, timezone),
        value: parseFloat(yOcc.values[index]),
        name: 'Occupancy',
        offset: 0,
      })),
    [xAxis, yOcc],
  )

  const dataCompare = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        date: getDateTimeForAxis(value, null, timezone),
        value: parseFloat(yOcc.compare[index]),
        name: 'Occupancy (Previous)',
        offset: yOcc.offset,
      })),
    [xAxis, yOcc],
  )

  const dataNow = useMemo(
    () => parseInt(find(yAxes, { key: 'now' }).values[0], 10),
    [yAxes],
  )

  const liveWidth = 300

  const xSize = dataOcc.length > 10 ? dataOcc.length * 100 : width
  const xMax = xSize - margin.left - margin.right

  const series = [dataOcc, dataCompare]
  const allData = series.reduce((rec, d) => rec.concat(d), [])

  const getX = d => d.date
  const getY = d => d.value
  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: extent(allData, getX),
  })
  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, max(allData, getY, threshold)],
  })
  const colorScale = scaleOrdinal({
    domain: ['Current Time Period', 'Past Time Period', 'Threshold'],
    range: colorRange,
  })
  const bisectDate = bisector(d => d.date).left

  const getD = useCallback(
    (x, lineData) => {
      const x0 = xScale.invert(x)
      const index = bisectDate(lineData, x0, 1)
      const d0 = lineData[index - 1]
      const d1 = lineData[index]
      let d = d0
      if (d1 && getX(d1)) {
        d =
          x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf()
            ? d1
            : d0
      }
      return d
    },
    [xScale, bisectDate],
  )
  const handleTooltip = useCallback(
    event => {
      const coords = localPoint(event) || { x: 0, y: 0 }
      const { x, y } = coords
      const occD = getD(x, dataOcc)
      const compareD = getD(x, dataCompare)
      showTooltip({
        tooltipData: { occD, compareD, threshold },
        tooltipLeft: x,
        tooltipTop: y,
      })
    },
    [showTooltip, getD, dataOcc, dataCompare, threshold],
  )

  const formatTooltipData = d => {
    if (d) {
      const date = formatTimeForTooltip(
        moment(d.date).unix() + (d.offset || 0),
        breakdown,
        null,
        timezone,
      )
      return `${date}, ${d.name}: ${d.value.toFixed(2)}`
    }
    return `No data.`
  }

  return width < 10 ? null : (
    <MGrid
      container
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <MGrid
        item
        lg={9}
        md={9}
        sm={12}
        xs={12}
        style={{
          position: 'relative',
          overflowX: 'scroll',
          float: 'left',
        }}
      >
        <svg ref={containerRef} width={xSize} height={height}>
          <rect
            width={xMax}
            height={xMax}
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
            yScale={yScale}
            width={xMax}
            height={yMax}
            stroke={darkMode ? 'white' : 'black'}
            strokeOpacity={0.2}
            strokeDasharray='1,3'
            pointerEvents='none'
          />
          {map(series, (lineData, i) => (
            <Group key={`lines-${i}`} top={margin.top} left={margin.left}>
              <LinePath
                curve={curveLinear}
                data={lineData}
                x={d => xScale(getX(d)) || 0}
                y={d => yScale(getY(d)) || 0}
                stroke={colorRange[i]}
                strokeWidth={2}
                strokeOpacity={1}
                shapeRendering='geometricPrecision'
              />
            </Group>
          ))}
          {threshold &&
            map(series, (lineData, i) => (
              <Group key={`lines-${i}`} top={margin.top} left={margin.left}>
                <LinePath
                  curve={curveLinear}
                  data={lineData}
                  x={d => xScale(getX(d)) || 0}
                  y={d => yScale(threshold)}
                  stroke={palette.error.main}
                  strokeWidth={2}
                  strokeOpacity={1}
                  shapeRendering='geometricPrecision'
                />
              </Group>
            ))}
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
          {tooltipOpen && dataOcc.length > 0 && tooltipData && (
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
            scale={yScale}
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
            top={yMax + margin.top}
            scale={xScale}
            tickFormat={d => {
              return formatTimeForAxis(
                moment(d).unix(),
                breakdown,
                null,
                timezone,
              )
            }}
            stroke={palette.grey[500]}
            hideTicks
            numTicks={NUM_TICKS}
            tickLabelProps={() => ({
              fill: palette.grey[800],
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
          {tooltipOpen && dataOcc.length > 0 && tooltipData && (
            <TooltipInPortal
              key={Math.random()} // update tooltip bounds each render
              top={tooltipTop}
              left={tooltipLeft}
              style={tooltipStyles}
            >
              {formatTooltipData(get(tooltipData, 'occD'))}
              <br />
              {formatTooltipData(get(tooltipData, 'compareD'))}
              <br />
              {`Threshold: ${threshold}`}
            </TooltipInPortal>
          )}
        </svg>
        <div style={{ position: 'relative' }}>
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
      </MGrid>
      <MGrid
        item
        lg={3}
        md={3}
        sm={12}
        xs={12}
        style={{
          float: 'left',
          height: yMax,
          top: margin.top,
          width: liveWidth,
          right: margin.right,
        }}
      >
        <Box
          display='block'
          flexDirection='column'
          height={1}
          width={1}
          bgcolor={palette.grey[50]}
        >
          <Box
            width={1}
            height={1}
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
          >
            <Typography variant='h1'>{dataNow || 0}</Typography>
          </Box>
          <Box>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              bgcolor={palette.error.main}
              pb={0.25}
              pt={0.25}
            >
              <Box ml={0.5} style={{ color: 'white' }}>
                <Typography variant='subtitle1'>Live</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </MGrid>
    </MGrid>
  )
}

function OccupancyChartV2Wrapper({
  xAxis,
  yAxes,
  breakdown,
  threshold,
  timezone,
}) {
  return (
    <ParentSize>
      {({ width }) => (
        <OccupancyChartV2
          width={width}
          height={384}
          xAxis={xAxis}
          yAxes={yAxes}
          breakdown={breakdown}
          threshold={threshold}
          timezone={timezone}
        />
      )}
    </ParentSize>
  )
}

OccupancyChartV2.propTypes = chartPropTypes
OccupancyChartV2Wrapper.propTypes = propTypes

export default OccupancyChartV2Wrapper
