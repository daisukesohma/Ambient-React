/*
 * author: rodaan@ambient.ai
 * A gauge that uses a ring/pie chart to show proportions
 */

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import MoreVert from '@material-ui/icons/MoreVert'
import { VictoryBar, VictoryStack } from 'victory'
import Paper from '@material-ui/core/Paper'
import clsx from 'clsx'

import '../../design_system/Theme.css'
import Icons from '../../icons'

import useStyles from './styles'

const { Close } = Icons

const propTypes = {
  color: PropTypes.string,
  darkMode: PropTypes.bool,
  datum: PropTypes.object,
  description: PropTypes.string,
  inlineShow: PropTypes.bool,
  isMoreCompShown: PropTypes.bool,
  moreComponent: PropTypes.object,
  onBarClick: PropTypes.func,
  title: PropTypes.string,
  total: PropTypes.number,
  value: PropTypes.number,
}

const defaultProps = {
  color: 'primary',
  darkMode: false,
  datum: null,
  description: 'Default Description',
  inlineShow: false,
  isMoreCompShown: false,
  moreComponent: undefined,
  onBarClick: () => {},
  title: 'Default Title',
  total: 1,
  value: 0,
}

const BarGauge = ({
  color,
  darkMode,
  description,
  inlineShow,
  isMoreCompShown,
  moreComponent,
  onBarClick,
  title,
  total,
  value,
}) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })
  const [isMoreShown, setIsMoreShown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef(null)

  const colorMap = {
    primary: palette.primary.main,
    secondary: palette.secondary.main,
    error: palette.error.main,
  }

  useEffect(() => {
    setIsMoreShown(isMoreCompShown)
  }, [isMoreCompShown])

  useEffect(() => {
    const updateSize = () => {
      const width = ref.current ? ref.current.offsetWidth : 0
      setIsMobile(width < 300)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const proportion =
    total === 0 || !total ? 0 : ((value / total) * 100).toFixed(0)

  return (
    <Paper classes={{ root: classes.root }} ref={ref}>
      <div
        className={classes.header}
        style={inlineShow && isMobile ? { flexDirection: 'column' } : null}
      >
        <div>
          <h6 className='am-h6'>{title}</h6>
          <div className={clsx('am-caption', classes.description)}>
            {description}
          </div>
        </div>
        {!inlineShow && moreComponent && !isMoreShown && (
          <div onClick={() => setIsMoreShown(true)} className={classes.moreBtn}>
            <MoreVert />
          </div>
        )}
        <div
          style={inlineShow && isMobile ? { margin: '10px 0 0 -10px' } : null}
        >
          {inlineShow && moreComponent}
        </div>
      </div>
      <div className={classes.dataContainer}>
        <div className={classes.valueContainer}>
          <div className={classes.percentValue}>
            <h4 className={classes.proportion}>
              {proportion}
              <span className={classes.percentSign}>%</span>
            </h4>
            <div className='am-button'>of total</div>
          </div>
          <h1 className={classes.value}>{value}</h1>
        </div>
        <VictoryStack
          colorScale={[colorMap[color], palette.grey[200]]}
          padding={0}
          height={40}
        >
          <VictoryBar
            horizontal
            data={[{ x: 'a', y: value }]}
            barWidth={60}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: () => {
                    return [
                      {
                        target: 'data',
                        mutation: props => {
                          // eslint-disable-line
                          onBarClick(props.datum)
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
          <VictoryBar
            data={[{ x: 'b', y: total > 0 ? total - value : 1 }]}
            barWidth={60}
            events={[
              {
                target: 'data',
                eventHandlers: {
                  onClick: () => {
                    return [
                      {
                        target: 'data',
                        mutation: props => {
                          // eslint-disable-line
                          onBarClick(props.datum)
                        },
                      },
                    ]
                  },
                },
              },
            ]}
          />
        </VictoryStack>
      </div>
      {isMoreShown && (
        <div className={classes.moreContainer}>
          <div className={classes.moreComponent}>{moreComponent}</div>
          <div
            className={classes.closeBtn}
            onClick={() => setIsMoreShown(false)}
          >
            <Close width={25} height={25} />
          </div>
        </div>
      )}
    </Paper>
  )
}

BarGauge.defaultProps = defaultProps
BarGauge.propTypes = propTypes

export default BarGauge
