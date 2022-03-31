import React from 'react'
import PropTypes from 'prop-types'

import LogoIcon from '../../../../../assets/logo_icon.png'

const propTypes = {
  containerStyle: PropTypes.object,
  width: PropTypes.number,
}

function Logo({ containerStyle, width }) {
  return (
    <span style={containerStyle}>
      <img alt='logo' src={LogoIcon} style={{ width }} />
    </span>
  )
}

Logo.propTypes = propTypes

export default Logo
