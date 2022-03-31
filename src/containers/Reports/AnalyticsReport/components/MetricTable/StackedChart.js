import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import sum from 'lodash/sum'
import get from 'lodash/get'
import map from 'lodash/map'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryTooltip,
  VictoryTheme,
  createContainer,
} from 'victory'

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

function StackedChart({ xAxis, yAxes }) {
  const { palette } = useTheme()
  const COLOR_MAP = [
    palette.primary.main,
    palette.error.light,
    palette.secondary.main,
  ]
  const VictoryCursorVoronoiContainer = createContainer('cursor', 'voronoi')
  const sums = map(get(xAxis, 'values'), (x, index) =>
    sum(map(yAxes, series => parseFloat(series.values[index]))),
  )

  const dataChart = map(yAxes, series =>
    sortBy(
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(series.values[index]),
        key: series.key,
        name: series.name,
        sum: sums[index],
      })),
      item => -1 * item.sum,
    ),
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
          labels={({ datum }) => {
            return `${datum.x}, ${datum.name}: ${datum.y}`
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
        {map(dataChart, (data, index) => {
          return (
            <VictoryBar
              key={yAxes[index].name}
              data={data}
              style={{
                data: {
                  fill: COLOR_MAP[index % COLOR_MAP.length],
                  opacity: ({ active }) => (active ? 1.0 : 0.8),
                },
                labels: { fill: 'white' },
              }}
            />
          )
        })}
      </VictoryStack>
      <VictoryAxis
        dependentAxis
        standalone={false}
        label='Count'
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

StackedChart.propTypes = propTypes

export default StackedChart
