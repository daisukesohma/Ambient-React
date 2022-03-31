import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import IndicatorStatusBadge from 'components/IndicatorStatusBadge'

const propTypes = {
  isActive: PropTypes.bool,
  pulseSize: PropTypes.number,
  variant: PropTypes.oneOf([null, 'secondary', 'red', 'yellow']),
  customStyles: PropTypes.object,
}

const defaultProps = {
  isActive: false,
  pulseSize: 6,
  variant: null,
}

function ActivePulse({ isActive, variant, pulseSize }) {
  const { palette } = useTheme()
  const colorMap = {
    secondary: palette.common.greenPastel,
    red: palette.error.main,
    yellow: palette.warning.main,
    primary: palette.primary.main,
  }

  let pulseColor
  let pulseRippleColor
  if (variant) {
    pulseColor = colorMap[variant]
    pulseRippleColor = variant
  } else {
    pulseColor = isActive
      ? palette.common.greenPastel
      : (pulseColor = palette.error.light)
    pulseRippleColor = isActive ? 'secondary' : 'red'
  }

  return (
    <IndicatorStatusBadge
      showLivePulse
      display='block'
      variant='naked'
      pulseColor={pulseColor}
      pulseRippleColor={pulseRippleColor}
      pulseSize={pulseSize}
      style={{
        position: 'relative',
        marginTop: -16,
        padding: 0,
        right: 0,
      }}
    />
  )
}

ActivePulse.propTypes = propTypes
ActivePulse.defaultProps = defaultProps

export default ActivePulse
