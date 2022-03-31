import React from 'react'
import PropTypes from 'prop-types'

const SVG = ({ bgFill, bgStroke, fill })=> {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" fill={bgFill} stroke={bgStroke} />
      <rect x="6" y="6" width="36" height="36" fill={fill}/>
      <rect x="6" y="6" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="24.5143" y="6" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="6" y="24.5144" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="24.5143" y="24.5144" width="17.4857" height="17.4857" fill={fill}/>
      <rect x="6" y="6" width="11.234" height="11.3143" fill={fill}/>
      <rect x="6" y="18.3428" width="11.234" height="11.3143" fill={fill}/>
      <rect x="6" y="30.6858" width="11.234" height="11.3143" fill={fill}/>
      <rect x="18.2553" y="6" width="11.234" height="11.3143" fill={fill}/>
      <rect x="18.2553" y="18.3428" width="11.234" height="11.3143" fill={fill}/>
      <rect x="18.2553" y="30.6858" width="11.234" height="11.3143" fill={fill}/>
      <rect x="30.5106" y="6" width="11.234" height="11.3143" fill={fill}/>
      <rect x="30.5106" y="18.3428" width="11.234" height="11.3143" fill={fill}/>
      <rect x="30.5106" y="30.6858" width="11.234" height="11.3143" fill={fill}/>
      <rect x="6" y="6" width="23.4894" height="23.6571" fill={fill}/>
      <rect x="6" y="30.6858" width="11.234" height="11.3143" fill={fill}/>
      <rect x="18.2553" y="30.6858" width="11.234" height="11.3143" fill={fill}/>
      <rect x="30.5106" y="6" width="11.234" height="11.3143" fill={fill}/>
      <rect x="30.5106" y="18.3428" width="11.234" height="11.3143" fill={fill}/>
      <rect x="30.5106" y="30.6858" width="11.234" height="11.3143" fill={fill}/>
      <rect x="33.5745" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="6" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="33.7715" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="24.383" y="24.5144" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="24.383" y="15.2571" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="24.383" y="6" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="6" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="15.2571" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="6" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="15.2571" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="6" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="15.2571" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="6" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="24.383" y="24.5144" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="24.383" y="6" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="6" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="33.7715" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="24.383" y="15.2571" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="15.2571" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="24.5144" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="6" y="6" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="24.383" y="24.5144" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="6" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="6" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="6" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="33.7715" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="6" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="15.2571" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="15.2571" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="6" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="24.383" y="6" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="24.383" y="24.5144" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="33.7715" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="24.5144" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="6" y="6" width="26.5532" height="26.7429" fill={fill}/>
      <rect x="33.5745" y="24.5144" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="6" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="24.383" y="33.7715" width="8.17022" height="8.22857" fill={fill}/>
      <rect x="6" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="15.1915" y="33.7715" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="33.5745" y="15.2571" width="8.17021" height="8.22857" fill={fill}/>
      <rect x="6" y="6" width="35.7447" height="17.4857" fill={fill}/>
      <rect x="6" y="24.5144" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="24.383" y="24.5144" width="17.3617" height="17.4857" fill={fill}/>
      <rect x="41.7447" y="42" width="35.7447" height="17.4857" transform="rotate(-180 41.7447 42)" fill={fill}/>
      <rect x="41.7447" y="23.4856" width="17.3617" height="17.4857" transform="rotate(-180 41.7447 23.4856)"
            fill={fill}/>
      <rect x="23.3617" y="23.4856" width="17.3617" height="17.4857" transform="rotate(-180 23.3617 23.4856)"
            fill={fill}/>
      <rect x="42" y="23.4856" width="36" height="17.4857" transform="rotate(-180 42 23.4856)" fill={fill}/>
      <rect x="42" y="42" width="36" height="17.4857" transform="rotate(-180 42 42)" fill={fill}/>
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
