import React, { useMemo } from 'react'
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import get from 'lodash/get'
import map from 'lodash/map'
// src
import { formatTimeForAxis } from '../../utils'

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
}

function Heatmap({ xAxis, yAxes, breakdown }) {
  const xAxisCast = useMemo(
    () =>
      map(get(xAxis, 'values'), value =>
        formatTimeForAxis(value, breakdown, xAxis.fmt),
      ),
    [xAxis, breakdown],
  )

  const data = useMemo(
    () =>
      map(yAxes, series => {
        const d = { stream: series.name }
        xAxisCast.forEach((x, index) => {
          d[x] = parseFloat(series.values[index])
        })
        return d
      }),
    [yAxes, xAxisCast],
  )

  const height = useMemo(() => 100 + 75 * yAxes.length, [yAxes])

  return (
    <Box style={{ overflowY: 'scroll' }} maxHeight={400}>
      <Box height={height}>
        <ResponsiveHeatMapCanvas
          data={data}
          keys={xAxisCast}
          indexBy='stream'
          margin={{ top: 100, right: 20, bottom: 20, left: 70 }}
          pixelRatio={2}
          minValue='auto'
          maxValue='auto'
          forceSquare={false}
          sizeVariation={0}
          padding={0.25}
          colors='OrRd'
          axisTop={{
            orient: 'top',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: 'Time',
            legendOffset: 36,
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Stream',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableGridX={false}
          enableGridY
          cellShape='rect'
          cellOpacity={1}
          cellBorderWidth={2}
          cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          enableLabels={false}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
          animate
          motionStiffness={120}
          motionDamping={9}
          isInteractive
          hoverTarget='rowColumn'
          cellHoverOpacity={1}
          cellHoverOthersOpacity={0.5}
        />
      </Box>
    </Box>
  )
}

Heatmap.propTypes = propTypes

export default Heatmap
