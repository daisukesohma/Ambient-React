import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Error as ErrorIcon } from '@material-ui/icons'
import { Paper } from '@material-ui/core'
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory'
import { map } from 'lodash'

import { Legend } from '../index'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    padding: 17,
    boxShadow: 'none',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& .VictoryContainer': {
      display: 'flex',
      alignItems: 'flex-end',
    },
    border: `1px solid ${palette.border.default}`,
  },
  legend: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    pointerEvents: 'none',
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

function BarChart({
  title,
  data,
  errorMessage,
  isLegendShown,
  onBarClick,
  description,
}) {
  const { palette } = useTheme()
  const classes = useStyles()
  const [show, setShow] = useState(false)

  const colorMap = {
    primary: palette.primary.main,
    secondary: palette.secondary.main,
    error: palette.error.main,
    [undefined]: palette.text.primary // default text color AS fallback color
  }

  const legend = map(data, ({ value, color }) => ({
    label: value,
    color: colorMap[color],
  }))

  return (
    <Paper classes={{ root: classes.root }} style={{ height: '100%' }}>
      <h6 className='am-h6'>{title}</h6>
      <div className='am-caption'>{description}</div>
      <div
        className={classes.legend}
        style={{
          display: show ? 'block' : 'none',
        }}
      >
        <Legend data={legend} />
      </div>
      {data.length > 0 ? (
        <VictoryChart padding={35}>
          <VictoryAxis
            tickValues={map(data, (val, key) => key)}
            tickFormat={map(data, ({ title }) =>
              title.length < 9 ? title : `${title.substring(0, 8)}...`,
            )}
            style={{
              axis: {
                stroke: 'none',
              },
              tickLabels: {
                fill: palette.text.primary,
                fontSize: 16,
                fontFamily: 'Aeonik-Regular',
              },
            }}
          />
          {isLegendShown ? (
            <VictoryBar
              data={data}
              style={{
                data: { fill: ({ datum }) => colorMap[datum.color] },
              }}
              y='value'
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onMouseOver: () => {
                      return [
                        {
                          target: 'data',
                          mutation: props => {
                            setShow(true)
                          },
                        },
                      ]
                    },
                    onMouseLeave: () => {
                      setShow(false)
                    },
                    onClick: () => {
                      return [
                        {
                          target: 'data',
                          mutation: ({ datum }) => {
                            onBarClick(datum)
                          },
                        },
                      ]
                    },
                  },
                },
              ]}
            />
          ) : (
            <VictoryBar
              data={data}
              style={{
                data: { fill: ({ datum }) => colorMap[datum.color] },
                labels: { fill: palette.text.primary },
              }}
              y='value'
              labels={({ datum }) => datum.value}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onClick: () => {
                      return [
                        {
                          target: 'data',
                          mutation: ({ datum }) => {
                            onBarClick(datum)
                          },
                        },
                      ]
                    },
                  },
                },
              ]}
            />
          )}
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

BarChart.defaultProps = {
  data: [],
  title: 'Default Title',
  clean: false,
  errorMessage: 'No data received',
  isLegendShown: false,
  onBarClick: () => {},
  description: '',
}

BarChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  clean: PropTypes.bool,
  errorMessage: PropTypes.string,
  isLegendShown: PropTypes.bool,
  onBarClick: PropTypes.func,
  description: PropTypes.string,
}

export default BarChart
