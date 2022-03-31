import React, { memo } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  getRailProps: PropTypes.func.isRequired,
}

export const SliderRail = ({ getRailProps }) => (
  <>
    <div className='react_time_range__rail__outer' {...getRailProps()} />
    <div className='react_time_range__rail__inner' />
  </>
)

SliderRail.propTypes = propTypes

export default memo(SliderRail)
