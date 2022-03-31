import React from 'react'
import { Icon } from 'react-icons-kit'
import { ic_more_horiz as icMoreHoriz } from 'react-icons-kit/md/ic_more_horiz'
import PropTypes from 'prop-types'

import OptionMenu from '../index'

import useStyles from './styles'

const MoreOptionMenu = ({ darkMode, lightIcon, iconSize, ...otherProps }) => {
  const classes = useStyles({ darkMode, lightIcon })

  const icon = (
    <div className={classes.iconContainer}>
      <Icon icon={icMoreHoriz} size={iconSize} />
    </div>
  )

  return <OptionMenu {...otherProps} icon={icon} darkMode={darkMode} />
}

MoreOptionMenu.propTypes = {
  lightIcon: PropTypes.bool,
  iconSize: PropTypes.number,
  ...OptionMenu.propTypes,
}

MoreOptionMenu.defaultProps = {
  lightIcon: false,
  iconSize: 28,
  ...OptionMenu.defaultProps,
}

export default MoreOptionMenu
