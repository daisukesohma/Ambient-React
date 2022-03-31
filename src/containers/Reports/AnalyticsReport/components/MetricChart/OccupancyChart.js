import React, { useMemo } from 'react'
import { useTheme } from '@material-ui/core/styles'
import {
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryTheme,
  VictoryLine,
  createContainer,
} from 'victory'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import parseInt from 'lodash/parseInt'
// src
import { formatTimeForAxis, formatTimeForTooltip } from '../../utils'
import propTypes from '../../propTypes/metric'
import useStyles from './styles'

function OccupancyChart({ xAxis, yAxes, breakdown, threshold }) {
  const { palette } = useTheme()
  const classes = useStyles()
  const VictoryCursorVoronoiContainer = createContainer('cursor', 'voronoi')
  const yOcc = useMemo(() => find(yAxes, { key: 'occupancy' }), [yAxes])

  const dataOcc = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yOcc.values[index]),
        name: 'Occupancy',
        offset: 0,
      })),
    [xAxis, yOcc],
  )

  const dataCompare = useMemo(
    () =>
      map(get(xAxis, 'values'), (value, index) => ({
        x: value,
        y: parseFloat(yOcc.compare[index]),
        name: 'Occupancy (Previous)',
        offset: yOcc.offset,
      })),
    [xAxis, yOcc],
  )

  const dataNow = useMemo(
    () => parseInt(find(yAxes, { key: 'now' }).values[0], 10),
    [yAxes],
  )

  return (
    <Grid container style={{ height: '100%' }}>
      <Grid item lg={9} md={9} sm={12} xs={12} className={classes.svgRoot}>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={20}
          padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
          containerComponent={
            <VictoryCursorVoronoiContainer
              cursorDimension='x'
              labels={({ datum }) => {
                const date = formatTimeForTooltip(
                  parseInt(datum.x, 10) + (datum.offset || 0),
                  breakdown,
                )
                return `${date}, ${datum.name}: ${datum.y.toFixed(2)}`
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
            data={dataOcc}
            style={{
              data: { stroke: palette.primary.main },
              labels: { fill: 'white' },
            }}
          />
          <VictoryLine
            data={dataCompare}
            style={{
              data: { stroke: palette.error.light },
              labels: { fill: 'white' },
            }}
          />
          {threshold && (
            <VictoryLine
              data={map(get(xAxis, 'values'), x => ({
                x,
                y: threshold,
                name: 'Threshold',
              }))}
              style={{
                data: { stroke: palette.error.main },
                labels: { fill: 'white' },
              }}
            />
          )}
          <VictoryAxis
            dependentAxis
            standalone={false}
            label={yOcc.name}
            fixLabelOverlap
            style={{
              tickLabels: { fontSize: 7, padding: 2 },
              axisLabel: { padding: 14, fontSize: 8 },
              ticks: { size: 1 },
            }}
          />
          <VictoryAxis
            crossAxis
            tickValues={xAxis.values}
            tickFormat={t => formatTimeForAxis(t, breakdown)}
            fixLabelOverlap
            style={{
              tickLabels: { fontSize: 7, padding: 2 },
              axisLabel: { padding: 14, fontSize: 8 },
              ticks: { size: 1 },
            }}
          />
        </VictoryChart>
      </Grid>
      <Grid item lg={3} md={3} sm={12} xs={12}>
        <Box
          display='flex'
          flexDirection='column'
          height={1}
          width={1}
          bgcolor={palette.grey[50]}
        >
          <Box
            width={1}
            height={1}
            display='flex'
            flexDirection='row'
            alignItems='center'
            justifyContent='center'
            className={dataNow && classes.liveOccupancyBox}
          >
            <Typography variant='heading1'>{dataNow || 'No data'}</Typography>
          </Box>
          <Box>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              justifyContent='center'
              bgcolor={palette.error.main}
              pb={0.25}
              pt={0.25}
            >
              <Box ml={0.5} style={{ color: 'white' }}>
                <Typography variant='subtitle1'>Live</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

OccupancyChart.propTypes = propTypes

export default OccupancyChart
