import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import LivePulse from './LivePulse'

function IndicatorStatusBadge({
  status,
  display,
  variant,
  showLivePulse,
  pulseColor,
  pulseRippleColor,
  pulseStyle,
  pulseSize,
  style = {},
  fontStyle = {},
}) {
  const { palette } = useTheme()
  // FUTURE: @eric
  // import { PlaybackStatusEnum } from '../../enums'
  // showLivePulse should only be utilized if status === 'live' ie.  PlaybackStatusEnum.LIVE

  const getVariantContainerStyle = (display, variant, style = {}) => {
    const variantStyle = {
      container: {
        display,
        position: 'absolute',
        right: 8,
        top: 8,
        borderRadius: 4,
        height: 26,
        padding: '0 10px',
      },
      filledContainer: {
        background: palette.error.main,
      },
      outlinedContainer: {
        background: 'rgba(0,0,0,0)',
        border: `2px solid ${palette.error.main}`,
      },
      nakedContainer: {
        border: 'none',
      },
    }

    if (variant === 'filled') {
      return {
        ...variantStyle.container,
        ...variantStyle.filledContainer,
        ...style,
      }
    }

    if (variant === 'outlined') {
      return {
        ...variantStyle.container,
        ...variantStyle.outlinedContainer,
        ...style,
      }
    }

    if (variant === 'naked') {
      return {
        ...variantStyle.container,
        ...variantStyle.nakedContainer,
        ...style,
      }
    }
    return {
      ...variantStyle.container,
      ...style,
    } // default
  }

  return (
    <span style={getVariantContainerStyle(display, variant, style)}>
      <span style={styles.statusContainer}>
        {showLivePulse && (
          <LivePulse
            color={pulseColor}
            pulseSize={pulseSize}
            rippleColor={pulseRippleColor}
            style={pulseStyle}
          />
        )}
        <span
          style={{
            ...styles.statusText,
            ...fontStyle,
          }}
        >
          {status}
        </span>
      </span>
    </span>
  )
}

// Defaults
// Can be overriden with style prop

const styles = {
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: '.75px',
    textTransform: 'uppercase',
  },
}

IndicatorStatusBadge.defaultProps = {
  pulseColor: '',
  pulseRippleColor: '#FFFFFF',
  pulseStyle: {},
  pulseSize: 6,
  status: '',
  display: 'none',
  variant: 'outlined',
  showLivePulse: true,
  style: {}, // container override
  fontStyle: {}, // font override
}

IndicatorStatusBadge.propTypes = {
  pulseColor: PropTypes.string,
  pulseSize: PropTypes.number,
  pulseRippleColor: PropTypes.string,
  pulseStyle: PropTypes.object,
  status: PropTypes.string,
  display: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'naked', 'outlined']),
  showLivePulse: PropTypes.bool,
  style: PropTypes.object,
  fontStyle: PropTypes.object,
}

export default IndicatorStatusBadge
