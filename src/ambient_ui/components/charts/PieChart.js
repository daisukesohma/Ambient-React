import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ErrorIcon from '@material-ui/icons/Error'
import { VictoryPie, VictoryLabel, VictoryTooltip, VictoryTheme } from 'victory'
import Paper from '@material-ui/core/Paper'

import { Legend } from '../index'

const useStyles = makeStyles(theme => ({
  am_chart: {
    padding: '0',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  am_root: {
    padding: '17px',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  am_error: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: `'Aeonik-Regular'`,
  },
  am_errorIcon: {
    marginRight: 10,
  },
  am_legend: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    pointerEvents: 'none',
  },
}))

class CustomLabel extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents

  state = {
    isSmall: false,
  }

  resizeHandler = () => {
    if (document.getElementById('chart-container')) {
      this.setState({
        isSmall: document.getElementById('chart-container').offsetWidth < 600,
      })
    }
  }

  componentDidMount() {
    this.resizeHandler()
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  render() {
    const { orientation, datum } = this.props
    const { isSmall } = this.state
    const padding = 7
    const fontSize = 10
    let centerOffset
    if (orientation === 'top') {
      centerOffset = { x: 0, y: padding * 2 + fontSize + 10 }
    } else if (orientation === 'bottom') {
      centerOffset = { x: 0, y: -(padding * 2 + fontSize + 10) }
    } else if (orientation === 'left') {
      centerOffset = {
        x: padding + (fontSize / 2) * datum.label.length + 15,
        y: 0,
      }
    } else if (orientation === 'right') {
      centerOffset = {
        x: -(padding + (fontSize / 2) * datum.label.length + 15),
        y: 0,
      }
    }
    return (
      <g>
        <VictoryLabel
          {...this.props}
          text={this.props.slice.value}
          style={{ color: 'black', fontSize: '14px' }}
        />
        <VictoryTooltip
          {...this.props}
          x={this.props.x}
          y={this.props.y}
          centerOffset={centerOffset}
          text={`${this.props.text}`}
          pointerLength={0}
          cornerRadius={12}
          style={{
            fill: '#626469',
            padding,
            fontSize: isSmall ? 2 * fontSize : fontSize,
          }}
          flyoutStyle={{ fill: 'white', stroke: '#DDE0E5', strokeWidth: 1 }}
        />
      </g>
    )
  }
}

CustomLabel.propTypes = {
  orientation: PropTypes.string,
  onPieClick: PropTypes.func,
  datum: PropTypes.shape({
    label: PropTypes.string,
  }),
  slice: PropTypes.shape({
    value: PropTypes.number,
  }),
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
  id: PropTypes.string,
}

const PieChart = ({
  title,
  data,
  id,
  clean,
  errorMessage,
  isLegendShown,
  onPieClick,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()

  const colorPalette = [
    palette.primary.main,
    palette.secondary.main,
    palette.primary.light,
    palette.secondary.dark,
    palette.primary.dark,
    palette.secondary.light,
    palette.common.tertiary,
  ]

  let inputData = data

  if (clean) {
    const cleanData = []
    for (let i = 0; i < data.length; ++i) {
      if (data[i].y > 0) {
        cleanData.push(data[i])
      }
    }
    inputData = cleanData
  }

  let chart = (
    <div className={classes.am_error}>
      <ErrorIcon color='error' className={classes.am_errorIcon} />
      {errorMessage}
    </div>
  )
  if (inputData.length > 0) {
    chart = (
      <VictoryPie
        theme={VictoryTheme.material}
        padAngle={0}
        labelComponent={<CustomLabel />}
        labels={d => {
          return d.label
        }}
        innerRadius={0}
        width={400}
        height={400}
        data={inputData}
        colorScale={inputData.map((dataPoint, i) => {
          return dataPoint.color || colorPalette[i % colorPalette.length]
        })}
        id={id}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: () => {
                return [
                  {
                    target: 'data',
                    mutation: props => {
                      onPieClick(props.datum)
                    },
                  },
                ]
              },
            },
          },
        ]}
      />
    )
    if (isLegendShown) {
      chart = (
        <VictoryPie
          theme={VictoryTheme.material}
          padAngle={0}
          innerRadius={0}
          width={400}
          height={400}
          data={inputData.map(d => ({ ...d, label: '' }))}
          labels={() => ''}
          colorScale={inputData.map((dataPoint, i) => {
            return colorPalette[i % colorPalette.length]
          })}
          id={id}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        onPieClick(props.datum)
                      },
                    },
                  ]
                },
              },
            },
          ]}
        />
      )
    }
  }

  const legend = data.map(({ y, label }, index) => ({
    label: `${label} : ${y}`,
    color: colorPalette[index % colorPalette.length],
  }))

  return (
    <Paper classes={{ root: classes.am_root }} style={{ height: '100%' }}>
      <h6 className='am-h6'>{title}</h6>
      <div
        className={classes.am_legend}
        style={{
          display: isLegendShown ? 'block' : 'none',
        }}
      >
        <Legend data={legend} />
      </div>
      <div className={classes.am_chart} id='chart-container'>
        {chart}
      </div>
    </Paper>
  )
}

PieChart.defaultProps = {
  data: [],
  title: 'Default Title',
  clean: false,
  errorMessage: 'No data received',
  isLegendShown: false,
  onPieClick: () => {},
  orientation: 'top',
  datum: {},
  slice: {},
  x: null,
  y: null,
  text: '',
  id: null,
}

PieChart.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  clean: PropTypes.bool,
  errorMessage: PropTypes.string,
  isLegendShown: PropTypes.bool,
  onPieClick: PropTypes.func,
  datum: PropTypes.shape({
    label: PropTypes.string,
  }),
  slice: PropTypes.shape({
    value: PropTypes.string,
  }),
  x: PropTypes.number,
  y: PropTypes.number,
  text: PropTypes.string,
  id: PropTypes.string,
}

export default PieChart
