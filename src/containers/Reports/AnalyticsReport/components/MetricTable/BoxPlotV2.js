/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Group } from '@vx/group'
import { BoxPlot } from '@vx/stats'
import { Grid } from '@vx/grid'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { LegendOrdinal } from '@vx/legend'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import map from 'lodash/map'
import min from 'lodash/min'
import max from 'lodash/max'

import { truncateStringByPxWidth } from '../../utils'

const propTypes = {
  xAxis: PropTypes.shape({
    name: PropTypes.string,
    fmt: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
  }),
  yAxes: PropTypes.arrayOf(
    PropTypes.shape({
      fmt: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
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

function BoxPlotV2({ xAxis, yAxes, width, height }) {
  const { palette } = useTheme()
  const margin = { top: 30, right: 30, bottom: 30, left: 30 }
  const yMax = height - margin.top - margin.bottom

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

  const data = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => {
        const yObject = yAxes.reduce((result, series) => {
          // Expecting q1, q3, median, min, max
          result[series.key] = parseFloat(series.values[index]).toFixed(2)
          return result
        }, {})
        return { x: value, ...yObject }
      }),
    [xAxis, yAxes],
  )

  const xSize = data.length > 5 ? data.length * 100 : width
  const xMax = xSize - margin.left - margin.right

  const values = data.reduce((allValues, d) => {
    allValues.push(d.min, d.max)
    return allValues
  }, [])

  const minYValue = min(values)
  const maxYValue = max(values)

  // scales
  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: map(data, 'x'),
    padding: 0.4,
  })
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [minYValue, maxYValue],
  })

  const colorScale = scaleOrdinal({
    domain: ['Interquartile Range', 'Median'],
    range: [palette.primary.main, palette.grey[500]],
  })

  const boxWidth = xScale.bandwidth()
  const constrainedWidth = Math.min(80, boxWidth)

  return width < 10 ? null : (
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
          height={height}
          fill='white'
          rx={14}
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
        <Group top={margin.top} left={margin.left}>
          {map(data, (d, i) => (
            <g key={i}>
              <BoxPlot
                min={parseInt(d.min, 10)}
                max={parseInt(d.max, 10)}
                left={xScale(d.x) + xScale.bandwidth() / 6}
                strokeWidth={1}
                firstQuartile={parseInt(d.q1, 10)}
                thirdQuartile={parseInt(d.q3, 10)}
                median={parseInt(d.median, 10)}
                boxWidth={constrainedWidth * 0.7}
                fill={palette.primary.main}
                fillOpacity={tooltipData && tooltipData.id === i ? 1 : 0.5}
                stroke={palette.primary.main}
                valueScale={yScale}
                minProps={{
                  onMouseOver: () => {
                    showTooltip({
                      tooltipTop: yScale(d.min) + 40,
                      tooltipLeft: xScale(d.x) + constrainedWidth + 5,
                      tooltipData: {
                        min: d.min,
                        name: d.x,
                      },
                    })
                  },
                  onMouseLeave: () => {
                    hideTooltip()
                  },
                }}
                maxProps={{
                  onMouseOver: () => {
                    showTooltip({
                      tooltipTop: yScale(d.max) + 40,
                      tooltipLeft: xScale(d.x) + constrainedWidth + 5,
                      tooltipData: {
                        max: d.max,
                        name: d.x,
                      },
                    })
                  },
                  onMouseLeave: () => {
                    hideTooltip()
                  },
                }}
                boxProps={{
                  onMouseOver: () => {
                    showTooltip({
                      tooltipTop: yScale(d.median) + 40,
                      tooltipLeft: xScale(d.x) + constrainedWidth + 5,
                      tooltipData: {
                        ...d,
                        name: d.x,
                        id: i,
                      },
                    })
                  },
                  onMouseLeave: () => {
                    hideTooltip()
                  },
                }}
                medianProps={{
                  style: {
                    stroke: palette.grey[500],
                    strokeWidth: 2,
                  },
                  onMouseOver: () => {
                    showTooltip({
                      tooltipTop: yScale(d.median) + 40,
                      tooltipLeft: xScale(d.x) + constrainedWidth + 5,
                      tooltipData: {
                        median: d.median,
                        name: d.x,
                      },
                    })
                  },
                  onMouseLeave: () => {
                    hideTooltip()
                  },
                }}
              />
            </g>
          ))}
          <AxisLeft
            hideTicks
            scale={yScale}
            // tickFormat={formatDate}
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
            tickFormat={d => truncateStringByPxWidth(constrainedWidth, d)}
            top={yMax}
            scale={xScale}
            stroke={palette.grey[500]}
            tickLabelProps={() => ({
              fill: palette.grey[800],
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
        </Group>
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
            <strong>{tooltipData.name}</strong>
          </div>
          <div className='am-caption' style={{ marginTop: 4 }}>
            {tooltipData.max && (
              <div>
                Max:
                {tooltipData.max}
              </div>
            )}
            {tooltipData.q3 && (
              <div>
                Third Quartile:
                {tooltipData.q3}
              </div>
            )}
            {tooltipData.median && (
              <div>
                Median:
                {tooltipData.median}
              </div>
            )}
            {tooltipData.q1 && (
              <div>
                First Quartile:
                {tooltipData.q1}
              </div>
            )}
            {tooltipData.min && (
              <div>
                Min:
                {tooltipData.min}
              </div>
            )}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

function BoxPlotV2Wrapper({ xAxis, yAxes }) {
  return (
    <ParentSize>
      {({ width }) => (
        <BoxPlotV2 width={width} height={500} xAxis={xAxis} yAxes={yAxes} />
      )}
    </ParentSize>
  )
}

BoxPlotV2.propTypes = chartPropTypes
BoxPlotV2Wrapper.propTypes = propTypes

export default BoxPlotV2Wrapper
