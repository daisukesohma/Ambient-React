import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'rc-slider'

const { Handle } = Slider

const propTypes = {
  value: PropTypes.number,
}

const defaultProps = {
  value: null,
}

const SliderHandle = ({ value, ...restProps }) => {
  return <Handle value={value} {...restProps} />
}

SliderHandle.propTypes = propTypes
SliderHandle.defaultProps = defaultProps

export default SliderHandle
