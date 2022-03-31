import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'
import map from 'lodash/map'
// src
import { funcs } from 'sagas/analytics/mockData'
import CounterChart from '../../MetricChart/CounterChart'

const heatmapRoot = 'https://dev.ambient.ai/static/analytics/heatmaps'

const getOccupancyData = () => {
  const xAxis = funcs.getXAxis(16 * 3600, 24 * 3600, 600)
  return {
    name: 'Utilization over time',
    type: 'column',
    xAxis: {
      fmt: 'timestamp',
      name: 'Time',
      values: xAxis,
    },
    yAxes: [
      {
        fmt: 'number',
        name: '% utilization',
        key: 'counter',
        values: funcs.baseline(40, 10, xAxis.length, 0.2),
        offset: 7 * 86400,
      },
    ],
  }
}

const getUtilizationData = () => {
  const xAxis = ['0%', '0-25%', '25-50%', '75-100%', '100%']
  const yAxis = funcs.sumToN(100, xAxis.length)

  return map(xAxis, (x, index) => ({ x, y: yAxis[index] }))
}

const propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  heatmapKey: PropTypes.string,
  options: PropTypes.object,
}

function ExpansionPanel({ open, title, heatmapKey, options }) {
  const width = 12 / (options.utilization + options.occupancy + options.heatmap)
  const heatmapURL = `${heatmapRoot}/${heatmapKey}.png`
  const occupancyData = getOccupancyData()
  const utilizationData = getUtilizationData()

  return (
    <Box p={2}>
      {!open ? (
        <Typography variant='caption'>Click a row to see details</Typography>
      ) : (
        <Grid container style={{ alignItems: 'center' }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant='heading6'>{title}</Typography>
          </Grid>
          {options.occupancy && (
            <Grid item lg={width} md={width} sm={12} xs={12}>
              <CounterChart
                xAxis={occupancyData.xAxis}
                yAxes={occupancyData.yAxes}
                breakdown={3600}
              />
            </Grid>
          )}
          {options.heatmap && (
            <Grid item lg={width} md={width} sm={12} xs={12}>
              <Box p={2}>
                <img
                  alt=''
                  src={heatmapURL}
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                    maxHeight: '300px',
                  }}
                />
              </Box>
            </Grid>
          )}
          {options.utilization && (
            <Grid item lg={width} md={width} sm={12} xs={12}>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={40}
                padding={{ top: 20, bottom: 25, left: 25, right: 20 }}
                height={250}
              >
                <VictoryBar
                  barWidth={20}
                  key='enters'
                  data={utilizationData}
                  style={{
                    data: {
                      strokeWidth: 1,
                      fill: '#4069ff',
                    },
                    labels: { fill: 'white' },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  standalone={false}
                  label='% of time'
                  fixLabelOverlap
                  style={{
                    tickLabels: { fontSize: 8, padding: 2 },
                    axisLabel: { padding: 15, fontSize: 8 },
                    ticks: { size: 2 },
                  }}
                />
                <VictoryAxis
                  crossAxis
                  label='% capacity utilized'
                  tickValues={map(utilizationData, 'x')}
                  fixLabelOverlap
                  style={{
                    tickLabels: { fontSize: 8, padding: 2 },
                    axisLabel: { padding: 15, fontSize: 8 },
                    ticks: { size: 1 },
                  }}
                />
              </VictoryChart>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  )
}

ExpansionPanel.propTypes = propTypes

export default ExpansionPanel
