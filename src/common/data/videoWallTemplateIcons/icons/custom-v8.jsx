import React from 'react'
import PropTypes from 'prop-types';

const SVG = ({ bgFill, bgStroke, fill })=> {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" fill={bgFill} stroke={bgStroke} />
      <rect x="41.7447" y="42" width="35.7447" height="17.4857" transform="rotate(-180 41.7447 42)" fill={fill}/>
      <rect x="41.7447" y="23.4856" width="17.3617" height="17.4857" transform="rotate(-180 41.7447 23.4856)"
            fill={fill}/>
      <rect x="23.3617" y="23.4856" width="17.3617" height="17.4857" transform="rotate(-180 23.3617 23.4856)"
            fill={fill}/>
    </svg>)
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

export default SVG
