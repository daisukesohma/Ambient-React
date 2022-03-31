import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ErrorIcon from '@material-ui/icons/Error'
import Paper from '@material-ui/core/Paper'
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryTheme,
  VictoryTooltip,
} from 'victory'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '17px',
    boxShadow: 'none',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .VictoryContainer': {
      display: 'flex',
      alignItems: 'flex-end',
    },
  },
  error: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: `'Aeonik-Regular'`,
  },
  errorIcon: {
    marginRight: 10,
  },
}))

const StackedBarChart = ({ data, labels, errorMessage }) => {
  const classes = useStyles()
  const { palette } = useTheme()

  return (
    <Paper classes={{ root: classes.root }}>
      {data.length > 0 ? (
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis
            tickValues={labels.map((i, k) => k)}
            tickFormat={labels}
            style={{
              axis: {
                stroke: 'none',
              },
              grid: {
                stroke: 'none',
              },
              tickLabels: {
                fill: palette.grey[700],
                fontSize: 10,
                fontFamily: 'Aeonik-Regular',
                angel: -45,
              },
            }}
          />
          <VictoryStack colorScale={data.map(d => d.color)}>
            {data.map((d, i) => (
              <VictoryBar
                key={i}
                data={d.values.map(v => ({ y: v, customLabel: d.label }))}
                labels={({ datum }) => `${datum.customLabel}: ${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    pointerLength={0}
                    cornerRadius={12}
                    style={{
                      fill: '#626469',
                      padding: 7,
                      fontSize: 10,
                    }}
                    flyoutStyle={{
                      fill: 'white',
                      stroke: '#DDE0E5',
                      strokeWidth: 1,
                    }}
                    constrainToVisibleArea
                  />
                }
              />
            ))}
          </VictoryStack>
        </VictoryChart>
      ) : (
        <div className={classes.error}>
          <ErrorIcon color='error' className={classes.errorIcon} />
          {errorMessage}
        </div>
      )}
    </Paper>
  )
}

StackedBarChart.defaultProps = {
  data: [],
  labels: [],
  errorMessage: 'No data received',
}

StackedBarChart.propTypes = {
  data: PropTypes.array,
  labels: PropTypes.array,
  errorMessage: PropTypes.string,
}

export default StackedBarChart
