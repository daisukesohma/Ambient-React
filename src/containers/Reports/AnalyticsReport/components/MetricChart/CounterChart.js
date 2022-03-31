import React, { useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import first from 'lodash/first'
import get from 'lodash/get'
import map from 'lodash/map'
import {
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  createContainer,
} from 'victory'
// src

import propTypes from '../../propTypes/metric'
import { formatTimeForAxis, formatTimeForTooltip } from '../../utils'

function CounterChart({ xAxis, yAxes, breakdown, threshold }) {
  const theme = useTheme()
  const VictoryCursorVoronoiContainer = createContainer('cursor', 'voronoi')
  const yCounter = first(yAxes)

  const dataCounter = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yCounter.values[index]),
        offset: 0,
        name: yCounter.name || 'Count',
      })),
    [xAxis, yCounter],
  )

  const dataCompare = useMemo(
    () =>
      yCounter.compare &&
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yCounter.compare[index]),
        offset: yCounter.offset,
        name: 'Count (Previous)',
      })),
    [xAxis, yCounter],
  )

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
      padding={{ top: 20, bottom: 25, left: 35, right: 20 }}
      height={250}
      containerComponent={
        <VictoryCursorVoronoiContainer
          cursorDimension='x'
          labels={({ datum }) => {
            if (datum.childName.indexOf('scatter') < 0) {
              const date = formatTimeForTooltip(
                parseInt(datum.x, 10) + (datum.offset || 0),
                breakdown,
                xAxis.fmt,
              )
              return `${date}, ${datum.name}: ${datum.y.toFixed(2)}`
            }
            return null
          }}
          voronoiDimension='x'
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: 8, padding: 2 }}
              dy={-7}
              constrainToVisibleArea
              pointerLength={0}
              cornerRadius={0}
              flyoutStyle={{
                fill: 'black',
              }}
            />
          }
        />
      }
    >
      <VictoryLine
        data={dataCounter}
        style={{
          data: {
            stroke: theme.palette.primary.main,
            strokeWidth: 1,
          },
          labels: { fill: theme.palette.common.white },
        }}
      />
      {dataCompare && (
        <VictoryLine
          data={dataCompare}
          style={{
            data: {
              stroke: theme.palette.error.light,
              strokeWidth: 1,
            },
            labels: { fill: theme.palette.common.white },
          }}
        />
      )}
      {threshold && (
        <VictoryLine
          data={map(get(xAxis, 'values'), x => ({
            x,
            y: threshold,
            name: 'Threshold',
          }))}
          style={{
            data: { stroke: theme.palette.error.main },
            labels: { fill: theme.palette.common.white },
          }}
        />
      )}
      <VictoryScatter
        name='scatterCounter'
        data={dataCounter}
        style={{
          data: {
            fill: ({ active }) =>
              active ? theme.palette.primary.main : theme.palette.common.white,
            stroke: theme.palette.primary.main,
            opacity: ({ active }) => (active ? 1.0 : 0.4),
            strokeWidth: ({ active }) => (active ? 2.0 : 1.0),
          },
        }}
      />
      {dataCompare && (
        <VictoryScatter
          name='scatterCompare'
          data={dataCompare}
          style={{
            data: {
              fill: ({ active }) =>
                active ? theme.palette.error.light : theme.palette.common.white,
              stroke: theme.palette.error.light,
              opacity: ({ active }) => (active ? 1.0 : 0.4),
              strokeWidth: ({ active }) => (active ? 2.0 : 1.0),
            },
          }}
        />
      )}
      <VictoryAxis
        crossAxis
        tickValues={xAxis.values}
        tickFormat={t => formatTimeForAxis(t, breakdown, xAxis.fmt)}
        label={xAxis.name}
        fixLabelOverlap
        style={{
          tickLabels: { fontSize: 7, padding: 2 },
          axisLabel: { padding: 14, fontSize: 8 },
          ticks: { size: 1 },
        }}
      />
      <VictoryAxis
        dependentAxis
        fixLabelOverlap
        label={yCounter.name}
        style={{
          tickLabels: { fontSize: 7, padding: 2 },
          axisLabel: { padding: 14, fontSize: 8 },
          ticks: { size: 1 },
        }}
      />
    </VictoryChart>
  )
}

CounterChart.propTypes = propTypes

export default CounterChart
