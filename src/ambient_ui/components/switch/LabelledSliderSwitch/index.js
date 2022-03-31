import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import SliderSwitch from '../index'

import { useStyles } from './styles'

const LabelledSliderSwitch = ({
  checked,
  darkIconContent,
  lightIconContent,
  ...props
}) => {
  const classes = useStyles()
  const darkIcon = (
    <div
      className={clsx(
        classes.thumb,
        classes.track,
        'am-subtitle1',
        classes.checkedIconColor,
      )}
    >
      {darkIconContent}
    </div>
  )

  const lightIcon = (
    <div
      className={clsx(
        classes.thumb,
        classes.switchBase,
        classes.iconColor,
        'am-subtitle1',
      )}
    >
      {lightIconContent}
    </div>
  )

  return (
    <SliderSwitch
      checked={checked}
      rightIcon={darkIcon}
      leftIcon={lightIcon}
      {...props}
    />
  )
}

LabelledSliderSwitch.defaultProps = {
  checked: false,
  darkIconContent: 'Dark',
  lightIconContent: 'Light',
}

LabelledSliderSwitch.propTypes = {
  checked: PropTypes.bool,
  darkIconContent: PropTypes.node,
  lightIconContent: PropTypes.node,
}

export default LabelledSliderSwitch
