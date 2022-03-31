import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
// src
import { hexRgba } from 'utils'

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.any,
}

Track.defaultProps = {
  disabled: false,
}

function Track({ error, source, target, getTrackProps, disabled }) {
  const { palette } = useTheme()
  const getTrackConfig = () => {
    const basicStyle = {
      left: `${source.percent}%`,
      width: `calc(${target.percent - source.percent}% - 1px)`,
    }

    if (disabled) return basicStyle

    const errorColor = hexRgba(palette.error.main, 0.35)
    const validColor = hexRgba(palette.secondary.main, 0.35)

    const coloredTrackStyle = error
      ? {
          backgroundColor: errorColor,
          borderLeft: `1px solid ${errorColor}`,
          borderRight: `1px solid ${errorColor}`,
        }
      : {
          backgroundColor: validColor,
          borderLeft: `1px solid ${validColor}`,
          borderRight: `1px solid ${validColor}`,
        }

    return { ...basicStyle, ...coloredTrackStyle }
  }

  const styles = getTrackConfig()

  return (
    <div
      className={`react_time_range__track${disabled ? '__disabled' : ''}`}
      style={styles}
      {...getTrackProps()}
    />
  )
}

export default memo(Track)
