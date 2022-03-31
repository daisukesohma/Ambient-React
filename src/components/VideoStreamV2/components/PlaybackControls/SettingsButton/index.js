import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'
import { settings } from 'react-icons-kit/feather/settings'

const SettingsButton = ({ darkMode }) => {
  const { palette } = useTheme()
  const color = darkMode ? palette.common.white : palette.common.black
  return (
    <div style={{ color, cursor: 'pointer' }}>
      <Icon icon={settings} />
    </div>
  )
}

SettingsButton.defaultProps = {
  darkMode: false,
}

SettingsButton.propTypes = {
  darkMode: PropTypes.bool,
}

export default SettingsButton
