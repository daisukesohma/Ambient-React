import React from 'react'
import { Icon } from 'react-icons-kit'
import { settings } from 'react-icons-kit/feather/settings'

import OptionMenu from '../index'

import useStyles from './styles'

const SettingsOptionMenu = ({ darkMode, ...otherProps }) => {
  const classes = useStyles({ darkMode })

  const icon = (
    <div className={classes.iconContainer}>
      <Icon icon={settings} size={14} />
    </div>
  )

  return <OptionMenu {...otherProps} icon={icon} darkMode={darkMode} />
}

SettingsOptionMenu.propTypes = {
  ...OptionMenu.propTypes,
}

SettingsOptionMenu.defaultProps = {
  ...OptionMenu.defaultProps,
}

export default SettingsOptionMenu
