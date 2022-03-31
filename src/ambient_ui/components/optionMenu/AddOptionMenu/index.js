import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import { plus } from 'react-icons-kit/feather/plus'
import Fab from '@material-ui/core/Fab'

import OptionMenu from '../index'

import { useStyles } from './styles'

const getIconSize = size => {
  if (size === 'medium') {
    return 24
  }
  if (size === 'large') {
    return 32
  }
  return 18 // 'small'
}

const AddOptionMenu = props => {
  const { size } = props
  const classes = useStyles({ size }) // used to override mui sizes

  const icon = (
    <Fab
      classes={{ root: classes.size }}
      size={size}
      color='primary'
      aria-label='add'
    >
      <Icon icon={plus} size={getIconSize(size)} />
    </Fab>
  )

  return <OptionMenu {...props} noBackground customIconContainer icon={icon} />
}

AddOptionMenu.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  ...OptionMenu.propTypes,
}

AddOptionMenu.defaultProps = {
  size: 'small',
  ...OptionMenu.defaultProps,
}

export default AddOptionMenu
