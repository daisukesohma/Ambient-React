import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import sum from 'lodash/sum'
import { BarStack } from '@vx/shape'
import { Group } from '@vx/group'
import { Grid } from '@vx/grid'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { localPoint } from '@vx/event'
import { LegendOrdinal } from '@vx/legend'
import get from 'lodash/get'
import map from 'lodash/map'
import max from 'lodash/max'
import values from 'lodash/values'
// src
import { truncateStringByPxWidth } from '../../utils'

const propTypes = {
  xAxis: PropTypes.shape({
    name: PropTypes.string,
    fmt: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
  }),
  yAxes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      fmt: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  breakdown: PropTypes.number,
}

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

function StackedChartV2({ xAxis, yAxes, width, height, events = false }) {
  const { palette } = useTheme()

  const COLOR_MAP = [
    palette.primary.main,
    palette.error.main,
    palette.secondary.main,
    palette.secondary.light,
    palette.common.greenNeon,
    palette.common.greenBluePastel,
  ]

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  })
  const margin = { top: 40, right: 30, bottom: 30, left: 60 }
  const yMax = height - margin.top - margin.bottom
  let tooltipTimeout
  const sums = map(get(xAxis, 'values'), (x, index) =>
    sum(map(yAxes, series => parseFloat(series.values[index]))),
  )

  const dataChart2 = map(get(xAxis, 'values'), (value, index) =>
    sortBy(
      map(yAxes, series => ({
        x: value,
        y: parseFloat(series.values[index]),
        key: series.name || 'Count',
        name: series.name,
        sum: sums[index],
      })),
      item => -1 * item.sum,
    ),
  )

  const dataChart3 = map(dataChart2, (data, index) => {
    const keys = map(data, 'key')
    const ys = map(data, 'y')
    const obj = { x: data[0].x, sum: sums[index] }
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = ys[i]
    }
    return obj
  })

  const xSize = dataChart3.length > 10 ? dataChart3.length * 100 : width
  const xMax = xSize - margin.left - margin.right

  const keys = map(yAxes, series => series.name || 'Count')

  const nameScale = scaleBand({
    domain: map(get(xAxis, 'values')),
    padding: 0.2,
  })
  const sumScale = scaleLinear({
    domain: [0, max(sums)],
    nice: true,
  })
  const colorScale = scaleOrdinal({
    domain: keys,
    range: COLOR_MAP,
  })

  nameScale.rangeRound([0, xMax])
  sumScale.range([yMax, 0])
  const leftAxisLabelColorLight = palette.grey[500]
  const boxWidth = nameScale.bandwidth()
  const constrainedWidth = Math.min(80, boxWidth)

  return width < 10 ? null : (
    // relative position is needed for correct tooltip positioning
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        paddingBottom: '8px',
        overflowX: 'scroll',
      }}
    >
      <svg ref={containerRef} width={xSize} height={height}>
        <rect
          y={margin.top}
          x={margin.left}
          width={xMax}
          height={yMax}
          rx={14}
          fill='white'
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={nameScale}
          yScale={sumScale}
          width={xMax}
          height={yMax}
          stroke={palette.grey[800]}
          strokeOpacity={0.1}
          strokeDasharray={3}
          xOffset={nameScale.bandwidth() / 2}
        />
        <Group top={margin.top} left={margin.left}>
          <BarStack
            data={dataChart3}
            keys={keys}
            x={d => d.x}
            xScale={nameScale}
            yScale={sumScale}
            color={colorScale}
          >
            {barStacks => {
              return map(barStacks, barStack =>
                map(get(barStack, 'bars'), bar => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip()
                      }, 300)
                    }}
                    onMouseMove={event => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout)
                      const coords = localPoint(
                        event.target.ownerSVGElement,
                        event,
                      )
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: coords.y,
                        tooltipLeft: coords.x,
                      })
                    }}
                  />
                )),
              )
            }}
          </BarStack>
        </Group>
        <AxisLeft
          hideTicks
          left={margin.left}
          top={margin.top}
          scale={sumScale}
          // tickFormat={formatDate}
          stroke='transparent'
          tickStroke={palette.grey[700]}
          tickLabelProps={() => ({
            fill: leftAxisLabelColorLight,
            fontSize: 11,
            textAnchor: 'end',
            dy: '0.33em',
          })}
        />
        <AxisBottom
          hideTicks
          top={yMax + margin.top}
          left={margin.left}
          scale={nameScale}
          tickFormat={d => truncateStringByPxWidth(constrainedWidth, d)}
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
          bottom: margin.bottom / 2 - 40,
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
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>{tooltipData.bar.data.x}</strong>
          </div>

          <div className='am-caption' style={{ marginTop: 4 }}>
            {tooltipData.key}
            :
            <br />
            {tooltipData.bar.data[tooltipData.key]}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

function StackedChartV2Wrapper({ xAxis, yAxes }) {
  return (
    <ParentSize>
      {({ width }) => (
        <StackedChartV2
          width={width}
          height={500}
          xAxis={xAxis}
          yAxes={yAxes}
        />
      )}
    </ParentSize>
  )
}

StackedChartV2.propTypes = chartPropTypes
StackedChartV2Wrapper.propTypes = propTypes

export default StackedChartV2Wrapper
