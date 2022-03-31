import React from 'react'
import PropTypes from 'prop-types';

const SVG = ({ bgFill, bgStroke, fill })=> {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" fill={bgFill} stroke={bgStroke} />
      <rect x="6.00001" y="6" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="24.5143" y="6" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="6.00001" y="24.5144" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="24.5143" y="24.5144" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="6" y="6" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="24.5143" y="6" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="24.5143" y="24.5144" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="33.7714" y="24.5144" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="24.5143" y="33.7715" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="33.7714" y="33.7715" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="6" y="24.5144" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="15.2571" y="24.5144" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="6" y="33.7715" width="8.22857" height="8.22857" fill={fill}/>
      <rect x="15.2571" y="33.7715" width="8.22857" height="8.22857" fill={fill}/>
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
