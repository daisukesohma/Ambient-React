import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSpring, animated } from 'react-spring'
import * as easings from 'd3-ease'

const propTypes = {
  value: PropTypes.number,
  fromColor: PropTypes.string,
  toColor: PropTypes.string,
}

const defaultProps = {
  value: null,
  toColor: '#1881FF',
  fromColor: '#626469',
}

function AnimatedValue({ value, fromColor, toColor }) {
  const [previousValue, setPreviousValue] = useState(0)
  const [isValueChanged, setIsValueChanged] = useState(false)

  const { color, count, opacity } = useSpring({
    to: [
      {
        color: isValueChanged ? toColor : fromColor,
        opacity: isValueChanged ? 0.7 : 1,
        count: previousValue,
      },
      {
        color: fromColor,
        opacity: 1,
        count: value,
      },
    ],
    from: {
      color: fromColor,
      opacity: 1,
      count: previousValue,
    },
    config: {
      duration: 300,
      easing: easings.easePolyIn,
    },
  })

  useEffect(() => {
    setIsValueChanged(value !== previousValue)
    setPreviousValue(value)
  }, [value, previousValue])

  if (typeof value !== 'number') {
    return null
  }

  return (
    <animated.span style={{ color, opacity }}>
      {count && count.interpolate(val => val.toFixed(0))}
    </animated.span>
  )
}

AnimatedValue.propTypes = propTypes
AnimatedValue.defaultProps = defaultProps

export default AnimatedValue
