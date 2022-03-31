import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import * as allCurves from '@vx/curve'
import { Group } from '@vx/group'
import { AreaClosed } from '@vx/shape' // LinePath, Line
import { scaleUtc, scaleLinear } from '@vx/scale'
import { max } from 'd3-array'
// import moment from 'moment'
// src
import { LinearGradient } from '@vx/gradient'
import { hexRgba } from 'utils'

import { generateMockData } from './getData'

export const gradientColor1 = 'rgba(0,0,0,0.2)'
export const gradientColor2 = 'rgba(0,0,0,0.4)'
// data accessors
const getX = d => d.date
const getY = d => Number(d.value)

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object),
  xDomain: PropTypes.arrayOf(PropTypes.instanceOf(Date)), // [date, date]
  xRange: PropTypes.arrayOf(PropTypes.number),
}

// curve types can be found in allCurves from @vx/curve
//
// view curve shapes here: https://github.com/d3/d3-shape#curveMonotoneX
// list of supported: https://www.npmjs.com/package/@vx/curve
//  https://vx-demo.now.sh/curves
//
// All curves tested:
// best: [curveMonotoneX]
// works: [curveStepBefore, curveCatmullRom, curveLinear]
// works but not well: [curveBasis]
// broken: [curveCardinal, curveBundle, curveNatural, curveMonotoneY]
//
//
function Curve({ width, height, data, xDomain, xRange }) {
  const useMockData = false // turns on using mock or not - for performance testing and prototyping
  const [curveType, setCurveType] = useState('curveMonotoneX') // eslint-disable-line
  // const [showPoints, setShowPoints] = useState(false) // show dots for datapoints // eslint-disable-line
  const svgHeight = height
  const initialData = !useMockData ? data : generateMockData()
  const [curveData, setCurveData] = useState(initialData)

  // for Mock generation of new data
  const resetMockData = useCallback(() => {
    return setCurveData(generateMockData())
  }, [])

  // for Mock generation of new data
  useEffect(() => {
    if (useMockData) {
      resetMockData()
    }
  }, [useMockData, resetMockData])

  useEffect(() => {
    if (data && !useMockData) {
      setCurveData(data)
    }
  }, [data, useMockData])

  // This is for scaling data points to visible dataset
  //
  // concatenates the curveData and reduces data key, this is to get the yScale for all data
  //  filter ONLY visible data, so yMax is scaled to ONLY VISIBLE data
  const allData = useMemo(
    () =>
      curveData
        .filter(d => d.visible)
        .reduce((rec, d) => rec.concat(d.data), []),
    [curveData],
  )

  // update scale output ranges
  const xScale = scaleUtc({ domain: xDomain, range: xRange })
  const yScale = scaleLinear({
    range: [height, 0],
    domain: [-(max(allData, getY) || 0) * 0.05, max(allData, getY) || 0], // domain starts slightly below 0
    nice: true,
    clamp: true, // get only values within the domain
    // https://github.com/d3/d3-scale/blob/master/README.md#continuous_clamp
  })

  return (
    <svg id='timeline-curve-line-markers' width={width} height={svgHeight}>
      <LinearGradient
        id='vx-curves-person-curve'
        from={gradientColor1}
        to={gradientColor2}
        rotate='-45'
      />
      {width > 8 &&
        curveData.map((curve, i) => (
          <Group key={`lines-${i}`} top={4}>
            {/* false &&
              showPoints &&
              curve.data.map((d, j) => (
                <circle
                  key={i + j}
                  r={0.5}
                  cx={xScale(getX(d))}
                  cy={yScale(getY(d))}
                  stroke={curve.color}
                  fill={curve.color}
                />
              )) */}
            {/* false &&
              curve.data.map((d, j) => (
                <Line
                  key={i + j}
                  from={{ x: xScale(getX(d)), y: yScale(getY(d)) }}
                  to={{
                    x: xScale(
                      moment(d.date)
                        .add(10, 'seconds')
                        .toDate(),
                    ),
                    y: yScale(getY(d)),
                  }}
                  stroke={curve.color}
                  fill={curve.color}
                  strokeWidth={4}
                />
              )) */}
            {/* false && curve.visible && (
              <LinePath
                curve={allCurves[curveType]}
                data={curve.data}
                x={d => xScale(getX(d))}
                y={d => yScale(getY(d))}
                stroke={curve.color}
                strokeWidth={1}
                shapeRendering='geometricPrecision'
              />
            ) */}
            {curve.visible && (
              <AreaClosed
                data={curve.data}
                x={d => xScale(getX(d))}
                y={d => yScale(getY(d))}
                stroke={curve.color}
                yScale={yScale}
                strokeWidth={1}
                fill={hexRgba(curve.color, 0.1)}
                curve={allCurves[curveType]}
              />
            )}
          </Group>
        ))}
    </svg>
  )
}

Curve.propTypes = propTypes

export default Curve
