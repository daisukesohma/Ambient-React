import React from 'react'
import PropTypes from 'prop-types';

const SVG = ({ bgFill, bgStroke, fill })=> {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="48" height="48" rx="4" stroke={bgStroke} fill={bgFill}/>
        <rect x="5" y="5" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="13.2051" y="5" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="21.4103" y="5" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="29.6154" y="5" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="37.8205" y="5" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="5" y="13.2051" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="13.2051" y="13.2051" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="21.4103" y="13.2051" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="29.6154" y="13.2051" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="37.8205" y="13.2051" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="5" y="21.4103" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="13.2051" y="21.4103" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="21.4103" y="21.4103" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="29.6154" y="21.4103" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="37.8205" y="21.4103" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="5" y="29.6154" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="13.2051" y="29.6154" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="21.4103" y="29.6154" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="29.6154" y="29.6154" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="37.8205" y="29.6154" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="5" y="37.8205" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="13.2051" y="37.8205" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="21.4103" y="37.8205" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="29.6154" y="37.8205" width="7.17949" height="7.17949" fill={fill}/>
        <rect x="37.8205" y="37.8205" width="7.17949" height="7.17949" fill={fill}/>
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

export default SVG
