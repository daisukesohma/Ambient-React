/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine,
  createContainer,
} from 'victory'
import max from 'lodash/max'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'
// src
import propTypes from '../../propTypes/metric'
import { formatTimeForAxis, formatTimeForTooltip } from '../../utils'

function FlowChart({ xAxis, yAxes, breakdown }) {
  const VictoryCursorVoronoiContainer = createContainer('cursor', 'voronoi')

  const yEnters = useMemo(() => find(yAxes, { key: 'enters' }), [yAxes])
  const yExits = useMemo(() => find(yAxes, { key: 'exits' }), [yAxes])
  const yNet = useMemo(() => find(yAxes, { key: 'net' }), [yAxes])
  const yCumOcc = useMemo(() => find(yAxes, { key: 'cumulative' }), [yAxes])

  const dataEnters = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yEnters.values[index]),
        name: yEnters.name,
      })),
    [xAxis, yEnters],
  )

  const dataExits = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: -1 * parseFloat(yExits.values[index]),
        name: yExits.name,
      })),
    [xAxis, yExits],
  )

  const dataNet = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yNet.values[index]),
        name: yNet.name,
      })),
    [xAxis, yNet],
  )

  const dataCumOcc = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yCumOcc.values[index]),
        name: yCumOcc.name,
      })),
    [xAxis, yCumOcc],
  )

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

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
      padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
      height={250}
      containerComponent={
        <VictoryCursorVoronoiContainer
          cursorDimension='x'
          labels={({ datum }) => {
            const date = formatTimeForTooltip(datum.x, breakdown)
            return `${date}, ${datum.name}: ${datum.y}`
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
      <VictoryStack>
        <VictoryBar
          barWidth={10}
          key='enters'
          data={dataEnters}
          y={d => d.y / barMaxima}
          style={{
            data: {
              strokeWidth: 1,
              fill: '#4069ff',
              opacity: ({ active }) => (active ? 1.0 : 0.4),
            },
            labels: { fill: 'white' },
          }}
        />
        <VictoryBar
          barWidth={10}
          key='exits'
          data={dataExits}
          y={d => d.y / barMaxima}
          style={{
            data: {
              fill: '#ffbfbf',
              opacity: ({ active }) => (active ? 1.0 : 0.4),
            },
            labels: { fill: 'white' },
          }}
        />
      </VictoryStack>
      <VictoryLine
        style={{
          data: { stroke: 'blue', strokeWidth: 1 },
          parent: { border: '1px solid #ccc' },
          labels: { fill: 'white' },
        }}
        data={dataNet}
        y={d => d.y / lineMaxima}
      />
      <VictoryAxis
        dependentAxis
        standalone={false}
        label='Count'
        fixLabelOverlap
        tickFormat={t => t * barMaxima}
        style={{
          tickLabels: { fontSize: 6, padding: 2 },
          axisLabel: { padding: 14, fontSize: 6 },
          ticks: { size: 1 },
        }}
      />
      <VictoryAxis
        crossAxis
        tickValues={xAxis.values}
        tickFormat={t => formatTimeForAxis(t, breakdown)}
        fixLabelOverlap
        style={{
          tickLabels: { fontSize: 5, padding: 2 },
          axisLabel: { padding: 14, fontSize: 6 },
          ticks: { size: 1 },
        }}
      />
      <VictoryAxis
        dependentAxis
        scale={{
          x: xAxis.fmt === 'time' ? 'time' : 'linear',
        }}
        orientation='right'
        fixLabelOverlap
        tickFormat={t => t * lineMaxima}
        style={{
          tickLabels: { fontSize: 5, padding: 2 },
          axisLabel: { padding: 14, fontSize: 6 },
          ticks: { size: 1 },
        }}
      />
    </VictoryChart>
  )
}

FlowChart.propTypes = propTypes

export default FlowChart
