import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { BarStack } from '@vx/shape'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { Group } from '@vx/group'
import { Grid } from '@vx/grid'
import { LegendOrdinal } from '@vx/legend'
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { localPoint } from '@vx/event'
import ParentSize from '@vx/responsive/lib/components/ParentSize'

import useStyles from './styles'

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
}

const propTypes = {
  data: PropTypes.array,
  darkMode: PropTypes.bool,
}

const StackBar = ({ width, height, data, darkMode }) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })
  const keys = Object.keys(data[0]).filter(key => key !== 'type')
  const margin = { top: 40, right: 0, bottom: 0, left: 20 }
  const tooltipTimeout = useRef(null)
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
  const xMax = width - margin.left
  const yMax = height - margin.top - 60

  const volumeTotals = data.reduce((allTotals, type) => {
    const totalVolume = keys.reduce((dailyTotal, k) => {
      return dailyTotal + Number(type[k])
    }, 0)
    allTotals.push(totalVolume)
    return allTotals
  }, [])

  // accessors
  const getType = d => d.type

  // scales
  const typeScale = scaleBand({
    domain: data.map(getType),
    padding: 0.2,
  })
  const volumeScale = scaleLinear({
    domain: [0, Math.max(...volumeTotals)],
    nice: true,
  })

  const colorRange = [
    palette.primary.main,
    palette.secondary.main,
    palette.secondary.light,
    palette.warning.main,
    palette.common.greenNeon,
    palette.common.greenBluePastel,
  ]
  const colorScale = scaleOrdinal({
    domain: keys,
    range: colorRange,
  })

  typeScale.rangeRound([0, xMax])
  volumeScale.range([yMax, 0])

  return width < 10 ? null : (
    // relative position is needed for correct tooltip positioning
    <div style={{ position: 'relative', marginTop: 16 }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={darkMode ? palette.common.black : palette.common.white}
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={typeScale}
          yScale={volumeScale}
          width={xMax}
          height={yMax}
          stroke={darkMode ? palette.common.white : palette.common.black}
          strokeOpacity={0.2}
          xOffset={typeScale.bandwidth() / 2}
        />
        <Group top={margin.top} left={margin.left}>
          <BarStack
            data={data}
            keys={keys}
            x={getType}
            xScale={typeScale}
            yScale={volumeScale}
            color={colorScale}
          >
            {barStacks =>
              barStacks.map(barStack => {
                return (
                  <g key={barStack.key}>
                    {barStack.index === barStacks.length - 1 && (
                      <>
                        <text
                          x={barStack.bars[0].x + barStack.bars[0].width / 2}
                          y={barStack.bars[0].y - 8}
                          className={classes.barTotal}
                        >
                          {volumeTotals[0]}
                        </text>
                        <text
                          x={barStack.bars[1].x + barStack.bars[1].width / 2}
                          y={barStack.bars[1].y - 8}
                          className={classes.barTotal}
                        >
                          {volumeTotals[1]}
                        </text>
                      </>
                    )}
                    {barStack.bars.map(bar => {
                      return (
                        <rect
                          key={`bar-stack-${barStack.index}-${bar.index}`}
                          x={bar.x}
                          y={bar.y}
                          height={bar.height}
                          width={bar.width}
                          fill={bar.color}
                          onMouseLeave={() => {
                            tooltipTimeout.current = window.setTimeout(() => {
                              hideTooltip()
                            }, 300)
                          }}
                          onMouseMove={event => {
                            if (tooltipTimeout.current) {
                              clearTimeout(tooltipTimeout.current)
                              tooltipTimeout.current = null
                            }
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
                      )
                    })}
                  </g>
                )
              })
            }
          </BarStack>
        </Group>
        <AxisLeft
          left={margin.left}
          tickTextFill={colorRange[0]}
          top={margin.top}
          scale={volumeScale}
          stroke={colorRange[0]}
          tickStroke={colorRange[0]}
          tickLabelProps={() => ({
            fill: colorRange[0],
            fontSize: 11,
            textAnchor: 'middle',
          })}
          labelProps={() => ({
            fill: colorRange[0],
            fontSize: 11,
            textAnchor: 'middle',
          })}
          tickFormat={d => d}
        />
        <AxisBottom
          left={margin.left}
          top={yMax + margin.top}
          scale={typeScale}
          tickFormat={d => d}
          stroke={colorRange[0]}
          tickStroke={colorRange[0]}
          tickLabelProps={() => ({
            fill: colorRange[0],
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />{' '}
      </svg>
      {/* packs alerts ambient alerts */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          fontSize: '12px',
          marginTop: 8,
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction='column'
          labelMargin='0 15px 0 0'
        />
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{tooltipData.bar.data[tooltipData.key]}</div>
        </TooltipInPortal>
      )}
    </div>
  )
}

const StackBarWrapper = ({ data, darkMode = false }) => {
  return (
    <ParentSize>
      {({ width }) => (
        <StackBar width={width} height={600} data={data} darkMode={darkMode} />
      )}
    </ParentSize>
  )
}

StackBar.propTypes = {
  ...propTypes,
  width: PropTypes.number,
  height: PropTypes.number,
}

StackBarWrapper.propTypes = propTypes

export default StackBarWrapper
