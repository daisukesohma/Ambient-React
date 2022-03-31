import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icons } from 'ambient_ui'

const propTypes = {
  size: PropTypes.number,
}

const defaultProps = {
  size: 18,
}

function AccessAlarmActivityIcon({ size }) {
  const { palette } = useTheme()
  return <Icons.Door width={size} height={size} stroke={palette.grey[500]} />
}

AccessAlarmActivityIcon.propTypes = propTypes
AccessAlarmActivityIcon.defaultProps = defaultProps

export default AccessAlarmActivityIcon
