import React from 'react'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'

import { useStyles } from './styles'

const SliderSwitch = ({ leftIcon, rightIcon, checked, ...props }) => {
  const classes = useStyles()

  return (
    <Switch
      checked={checked}
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...(leftIcon ? { checkedIcon: rightIcon } : {})}
      {...(rightIcon ? { icon: leftIcon } : {})}
      {...props}
    />
  )
}

SliderSwitch.defaultProps = {
  checked: false,
  leftIcon: null,
  rightIcon: null,
}

SliderSwitch.propTypes = {
  checked: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
}

export default SliderSwitch
