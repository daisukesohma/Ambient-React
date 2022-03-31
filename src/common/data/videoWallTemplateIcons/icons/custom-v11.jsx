import React from 'react'
import PropTypes from 'prop-types';

const SVG = ({ bgFill, bgStroke, fill })=> {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="48" height="48" rx="4" stroke={bgStroke} fill={bgFill}/>
      <rect x="5" y="5" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="11.8085" y="5" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="18.6171" y="5" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="25.4255" y="5" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="32.2341" y="5" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="5" y="39.0425" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="11.8085" y="39.0425" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="18.6171" y="39.0425" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="25.4255" y="39.0425" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="32.2341" y="39.0425" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="5" y="11.8085" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="11.8085" y="11.8085" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="18.6171" y="11.8085" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="25.4255" y="11.8085" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="32.2341" y="11.8085" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="5" y="18.617" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="11.8085" y="18.617" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="18.6171" y="18.617" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="25.4255" y="18.617" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="32.2341" y="18.617" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="5" y="25.4256" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="11.8085" y="25.4256" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="18.6171" y="25.4256" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="25.4255" y="25.4256" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="32.2341" y="25.4256" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="5" y="32.2341" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="11.8085" y="32.2341" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="18.6171" y="32.2341" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="25.4255" y="32.2341" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="32.2341" y="32.2341" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="39.0426" y="5" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="39.0426" y="39.0425" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="39.0426" y="11.8085" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="39.0426" y="18.617" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="39.0426" y="25.4256" width="5.95745" height="5.95745" fill={fill}/>
      <rect x="39.0426" y="32.2341" width="5.95745" height="5.95745" fill={fill}/>
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
