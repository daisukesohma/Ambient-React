import React from 'react'
import PropTypes from 'prop-types'

const SVG = ({ bgFill, bgStroke, fill })=> {
  return (

    <svg xmlns="http://www.w3.org/2000/svg" width="48.029411735831644" height="48.02941187607786" fill="none">
      <rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/>


      <defs>
        <filter id="filter0_d" x="0.000003814699994109105" y="-27" width="135.7449951171875" height="136"
                filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="25"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.384314 0 0 0 0 0.392157 0 0 0 0 0.411765 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
      </defs>
      <g className="currentLayer"><title>Layer 1</title>
        <g>
          <rect x="0.5451416522264481" y="0.5062277242541313" width="47" height="47" rx="3.5" fill={bgFill}
                stroke={bgStroke}
                id="svg_1"/>
          <g filter="url(#filter0_d)" id="svg_2">
            <rect x="6.045141652226448" y="6.006227724254131" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_3"/>
            <rect x="6.045141652226448" y="18.34902786463499" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_4"/>
            <rect x="6.045141652226448" y="30.692026369273663" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_5"/>
            <rect x="18.3004402667284" y="6.006227724254131" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_6"/>
            <rect x="18.3004402667284" y="18.34902786463499" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_7"/>
            <rect x="18.3004402667284" y="30.692026369273663" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_8"/>
            <rect x="30.555738881230354" y="6.006227724254131" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_9"/>
            <rect x="30.555738881230354" y="18.34902786463499" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_10"/>
            <rect x="30.555738881230354" y="30.692026369273663" width="11.234000205993652" height="11.314299583435059"
                  fill={fill} id="svg_11"/>
          </g>
        </g>
      </g>
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
