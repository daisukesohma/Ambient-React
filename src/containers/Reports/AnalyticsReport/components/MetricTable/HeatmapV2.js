/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-bitwise */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { scaleLinear } from '@vx/scale'
import { AxisLeft, AxisTop } from '@vx/axis'
import { HeatmapRect } from '@vx/heatmap'
import { Group } from '@vx/group'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { useTooltip, useTooltipInPortal, defaultStyles } from '@vx/tooltip'
import { localPoint } from '@vx/event'
import get from 'lodash/get'
import map from 'lodash/map'
import concat from 'lodash/concat'
// src
import {
  formatTimeForAxis,
  truncateStringByPxWidthEnd,
  formatChartNumbers,
  formatTimeForTooltip,
} from '../../utils'

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
  breakdown: PropTypes.number,
  isPositive: PropTypes.bool,
  isPercentage: PropTypes.bool,
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

export const background = 'white'

// const binData = genBins(/* length = */ 16, /* height = */ 16);

function max(data, value) {
  return Math.max(...data.map(value))
}

// accessors
const bins = d => d.bins
const count = d => d.count

const defaultMargin = { top: 30, left: 110, right: 30, bottom: 30 }

function HeatmapV2({
  width,
  height,
  xAxis,
  margin = defaultMargin,
  yAxes,
  breakdown,
  isPercentage,
  isPositive,
  timezone,
}) {
  // bounds
  const { palette } = useTheme()

  const color1 = '#ff8f03'
  const color2 = '#bf0000'
  const color3 = palette.primary.main
  const color4 = palette.secondary.main

  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip()
  let tooltipTimeout

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  })

  const xAxisCast = map(get(xAxis, 'values'))

  // index 0 is blank due to how linear scale always adds one extra tick with scaleLinear.
  // we hide the extra tick using hideZero prop, and push all other labels forward one.
  const labels = concat([''], map(yAxes, 'name'))
  const xLabels = concat(
    [''],
    map(xAxisCast, value =>
      formatTimeForAxis(value, breakdown, xAxis.fmt, timezone),
    ),
  )

  const binData = map(xAxisCast, (label, index) => {
    const inner = map(yAxes, series => ({
      key: series.key,
      name: series.name,
      count: series.values[index],
      time: label,
    }))
    return {
      bin: index,
      bins: inner,
    }
  })

  const lightOrDark = color => {
    // Check the format of the color, HEX or RGB?
    const colorArray = []
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      const convertedColor = color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
      )

      colorArray.push(convertedColor[1])
      colorArray.push(convertedColor[2])
      colorArray.push(convertedColor[3])
    } else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      const convertedColor = +`0x${color
        .slice(1)
        .replace(color.length < 5 && /./g, '$&$&')}`

      colorArray.push(convertedColor >> 16)
      colorArray.push((convertedColor >> 8) & 255)
      colorArray.push(convertedColor & 255)
    }

    // http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(
      0.299 * (colorArray[0] * colorArray[0]) +
        0.587 * (colorArray[1] * colorArray[1]) +
        0.114 * (colorArray[2] * colorArray[2]),
    )

    // Using the HSP value, determine whether the color is light or dark
    return hsp <= 127.5
  }

  const xSize = binData.length > 10 ? binData.length * 72 : width
  const xMax = xSize - margin.left - margin.right
  const ySize = labels.length > 7 ? labels.length * 50 : height
  const yMax = ySize - margin.bottom - margin.top

  const colorMax = max(binData, d => max(bins(d), count))
  const bucketSizeMax = max(binData, d => bins(d).length)
  // scales
  const xScale = scaleLinear({
    domain: [0, binData.length],
    range: [0, xMax],
  })
  const yScale = scaleLinear({
    domain: [0, bucketSizeMax],
    range: [yMax, 0],
  })
  const rectColorScale = isPositive
    ? scaleLinear({
        range: [color1, color2],
        domain: [0, colorMax],
      })
    : scaleLinear({
        range: [color3, color4],
        domain: [0, colorMax],
      })
  const opacityScale = scaleLinear({
    range: [0.2, 1],
    domain: [0, colorMax],
  })

  const binWidth = xMax / binData.length
  const binHeight = yMax / bucketSizeMax
  const overflowX = binData.length > 10 ? 'scroll' : 'hidden'
  const overflowY = labels.length > 7 ? 'scroll' : 'hidden'
  const axisLeftTop = isFinite(binHeight)
    ? margin.top + 10 + 4 + binHeight / 2
    : 0
  const axisTopLeft = isFinite(binWidth) ? margin.left - binWidth / 2 : 0

  return width < 10 ? null : (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowX,
        overflowY,
      }}
    >
      <svg
        ref={containerRef}
        width={xSize}
        height={ySize}
        style={{ position: 'relative' }}
      >
        <rect x={0} y={0} width={xSize} height={ySize} rx={14} fill='white' />
        <Group top={0} left={margin.left}>
          <HeatmapRect
            data={binData}
            xScale={xScale}
            yScale={yScale}
            colorScale={rectColorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={2}
          >
            {heatmap => {
              return map(heatmap, heatmapBins =>
                map(heatmapBins, bin => (
                  <g key={`heatmap-group-${bin.row}-${bin.column}`}>
                    <rect
                      key={`heatmap-rect-${bin.row}-${bin.column}`}
                      className='vx-heatmap-rect'
                      width={bin.width}
                      height={bin.height}
                      x={bin.x}
                      y={bin.y - bin.height + margin.top + 10}
                      fill={bin.color}
                      fillOpacity={
                        tooltipData &&
                        (tooltipData.row === bin.row ||
                          tooltipData.column === bin.column)
                          ? bin.opacity
                          : tooltipData
                          ? 0.1
                          : bin.opacity
                      }
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
                          tooltipData: bin,
                          tooltipTop: coords.y,
                          tooltipLeft: coords.x,
                        })
                      }}
                    />
                    <text
                      key={`heatmap-text-${bin.row}-${bin.column}`}
                      x={bin.x + bin.width / 2}
                      y={bin.y - bin.height / 2 + margin.top + 13}
                      fontFamily='Aeonik-Medium'
                      fontSize='16'
                      fill={
                        lightOrDark(bin.color) && bin.opacity > 0.7
                          ? 'white'
                          : 'black'
                      }
                      dominantBaseline='middle'
                      textAnchor='middle'
                    >
                      {formatChartNumbers(parseInt(bin.bin.count, 10))}
                      {isPercentage && '%'}
                    </text>
                  </g>
                )),
              )
            }}
          </HeatmapRect>
          <AxisLeft
            hideZero
            hideTicks
            top={axisLeftTop}
            scale={yScale}
            tickFormat={d => {
              return truncateStringByPxWidthEnd(margin.left - 32, labels[d])
            }}
            stroke='transparent'
            numTicks={labels.length - 1}
            tickStroke='black'
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
            })}
          />
        </Group>

        <AxisTop
          hideZero
          hideTicks
          top={margin.top + 10 + 8}
          left={axisTopLeft}
          scale={xScale}
          numTicks={xLabels.length - 1}
          tickFormat={d => xLabels[d]}
          stroke='transparent'
          tickLabelProps={() => ({
            fill: 'black',
            fontSize: 11,
            textAnchor: 'middle',
            dy: '-0.33em',
          })}
        />
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>{tooltipData.bin.name}</strong>
          </div>
          <div className='am-caption' style={{ marginTop: 4 }}>
            Date:{' '}
            {formatTimeForTooltip(
              tooltipData.bin.time,
              breakdown,
              xAxis.fmt,
              timezone,
            )}
            <br />
            {isPercentage ? 'Percentage' : 'Count'}:{' '}
            {parseInt(tooltipData.bin.count, 10)}
            {tooltipData.bin.opacity}
            {tooltipData.bin.color}
            {isPercentage && '%'}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

function HeatmapV2Wrapper({
  xAxis,
  yAxes,
  breakdown,
  isPercentage = false,
  isPositive = true,
  timezone,
}) {
  return (
    <ParentSize>
      {({ width }) => (
        <HeatmapV2
          width={width}
          height={386}
          xAxis={xAxis}
          yAxes={yAxes}
          breakdown={breakdown}
          isPercentage={isPercentage}
          isPositive={isPositive}
          timezone={timezone}
        />
      )}
    </ParentSize>
  )
}

HeatmapV2.propTypes = chartPropTypes
HeatmapV2Wrapper.propTypes = propTypes

export default HeatmapV2Wrapper
