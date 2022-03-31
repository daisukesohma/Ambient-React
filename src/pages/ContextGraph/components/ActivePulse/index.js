import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
// src
import IndicatorStatusBadge from 'components/IndicatorStatusBadge'

function ActivePulse({ isActive }) {
  const { palette } = useTheme()
  return (
    <IndicatorStatusBadge
      showLivePulse
      display='block'
      variant='naked'
      pulseColor={isActive ? palette.common.greenPastel : palette.error.light}
      pulseRippleColor={isActive ? 'secondary' : 'red'}
      style={{
        position: 'relative',
        marginTop: -16,
        padding: 0,
        right: 0,
      }}
    />
  )
}

ActivePulse.propTypes = {
  isActive: PropTypes.bool,
}

export default ActivePulse
