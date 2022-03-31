/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  VictoryBoxPlot,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
  createContainer,
} from 'victory'
import get from 'lodash/get'
import map from 'lodash/map'

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

function BoxPlot({ xAxis, yAxes }) {
  const { palette } = useTheme()
  const VictoryCursorVoronoiContainer = createContainer('cursor', 'voronoi')

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

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={20}
      padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
      height={250}
      containerComponent={
        <VictoryCursorVoronoiContainer
          cursorDimension='x'
          voronoiDimension='x'
          labels={({ datum }) => {}}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: 8, padding: 2 }}
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
      <VictoryBoxPlot
        boxWidth={10}
        medianLabels
        data={data}
        style={{
          min: { stroke: palette.error.main, strokeWidth: 2 },
          max: { stroke: palette.primary.main, strokeWidth: 2 },
          q1: { fill: palette.error.main },
          q3: { fill: palette.primary.main },
          median: { fill: palette.grey[500], strokeWidth: 2 },
          medianLabels: { fontSize: 6 },
        }}
      />
      <VictoryAxis
        dependentAxis
        standalone={false}
        label='Occupancy statistics'
        fixLabelOverlap
        style={{
          tickLabels: { fontSize: 6, padding: 2 },
          axisLabel: { padding: 14, fontSize: 6 },
          ticks: { size: 1 },
        }}
      />
      <VictoryAxis
        crossAxis
        tickValues={xAxis.values}
        fixLabelOverlap
        style={{
          tickLabels: { fontSize: 5, padding: 2 },
          axisLabel: { padding: 14, fontSize: 6 },
          ticks: { size: 1 },
        }}
      />
    </VictoryChart>
  )
}

BoxPlot.propTypes = propTypes

export default BoxPlot
