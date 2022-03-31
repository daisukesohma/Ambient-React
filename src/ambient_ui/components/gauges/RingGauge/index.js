/*
 * author: rodaan@ambient.ai
 * A gauge that uses a ring/pie chart to show proportions
 */
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { VictoryPie, VictoryLabel } from 'victory'
import { Paper } from '@material-ui/core'
import { map } from 'lodash'

import { light } from 'theme'
import '../../design_system/Theme.css'
import { Legend } from '../../index'

import useStyles from './styles'

const RingGauge = ({
  colorMap,
  data,
  onRingClick,
  title,
  total,
  otherProps,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()

  const [show, setShow] = useState(false)
  const [totalFontSize, setTotalFontSize] = useState(0)

  const ref = useRef(null)

  const mainColorMap = {
    primary: palette.primary.main,
    secondary: palette.secondary.main,
    error: palette.grey[200],
  }

  const keys = Object.keys(colorMap)

  for (let i = 0; i < keys.length; ++i) {
    mainColorMap[keys[i]] = colorMap[keys[i]]
  }

  const transformData = isOuter => {
    const transformedData = []
    for (let i = 0; i < data.length; ++i) {
      let color = mainColorMap[data[i].color]
      if (isOuter) {
        color = data[i].color === 'error' ? 'none' : palette.primary.main
      }
      const transformedPoint = {
        x: data[i].label,
        y: data[i].value,
        color,
      }
      transformedData.push(transformedPoint)
    }
    return transformedData
  }

  const transformedDataOuter = transformData(true)
  const transformedDataInner = transformData(false)

  const legend = map(data, ({ label, value, color }) => ({
    label: `${label} : ${value}`,
    color: colorMap[color],
  }))

  const eventHandlers = [
    {
      target: 'data',
      eventHandlers: {
        onMouseOver: () => {
          setShow(true)
        },
        onMouseLeave: () => {
          setShow(false)
        },
        onClick: () => {
          return [
            {
              target: 'data',
              mutation: ({ datum }) => {
                // eslint-disable-line
                onRingClick(datum)
              },
            },
          ]
        },
      },
    },
  ]

  useEffect(() => {
    setTotalFontSize(
      Math.min((ref.current.offsetWidth - 70) / total.toString().length, 100),
    )
  }, [total])

  return (
    <Paper
      classes={{ root: classes.am_root }}
      style={{ height: '100%' }}
      {...otherProps.root}
    >
      <div className='am-h6'>{title}</div>
      <div
        className={classes.am_legend}
        style={{
          display: show ? 'block' : 'none',
        }}
      >
        <Legend data={legend} />
      </div>
      <div
        className={classes.am_chart}
        ref={ref}
        {...otherProps.chartContainer}
      >
        <svg viewBox='0 0 400 400' {...otherProps.svg}>
          <VictoryPie
            padAngle={0}
            standalone={false}
            labelComponent={<g />}
            innerRadius={200}
            width={400}
            height={400}
            data={transformedDataOuter}
            colorScale={map(transformedDataOuter, 'color')}
            events={eventHandlers}
          />
          <VictoryPie
            padAngle={0}
            standalone={false}
            labelComponent={<g />}
            innerRadius={180}
            width={400}
            height={400}
            data={transformedDataInner}
            colorScale={map(transformedDataInner, 'color')}
            events={eventHandlers}
          />
          <VictoryLabel
            textAnchor='middle'
            verticalAnchor='middle'
            x={200}
            y={200}
            text={`${Math.round(total)}`}
            style={{
              fontSize: totalFontSize,
              fontFamily: 'Aeonik-Regular',
              fill: palette.text.primary,
            }}
          />
        </svg>
      </div>
    </Paper>
  )
}

RingGauge.defaultProps = {
  colorMap: {
    primary: light.primary.main,
    secondary: light.secondary.main,
    error: light.grey[200],
  },
  data: [],
  datum: null,
  onRingClick: () => {},
  otherProps: {},
  title: 'Default Title',
  total: 0,
}

RingGauge.propTypes = {
  colorMap: PropTypes.object,
  data: PropTypes.array,
  datum: PropTypes.object,
  onRingClick: PropTypes.func,
  otherProps: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
}

export default RingGauge
