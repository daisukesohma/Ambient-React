import React from 'react'
import PropTypes from 'prop-types';

const SVG = ({ bgFill, bgStroke, fill }) => {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect id='template-bg' x="0.5" y="0.5" width="47" height="47" rx="3.5" fill={bgFill} stroke={bgStroke}/>
      <rect x="6" y="6" width="23.4894" height="23.6571" fill={fill} />
      <rect x="6" y="30.6858" width="11.234" height="11.3143" fill={fill} />
      <rect x="18.2553" y="30.6858" width="11.234" height="11.3143" fill={fill} />
      <rect x="30.5106" y="6" width="11.234" height="11.3143" fill={fill} />
      <rect x="30.5106" y="18.3428" width="11.234" height="11.3143" fill={fill} />
      <rect x="30.5106" y="30.6858" width="11.234" height="11.3143" fill={fill} />
    </svg>
  )
}

SVG.propTypes = {
  bgFill: PropTypes.string.isRequired,
  bgStroke: PropTypes.string,
  fill: PropTypes.string
}

SVG.defaultProps = {
  bgFill: 'white',
  bgStroke: "#DDE0E5",
  fill: '#9FA2A7'
}

export default SVG;
