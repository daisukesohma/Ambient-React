/* eslint-disable import/no-named-as-default */
import React from 'react'
import Fab from '@material-ui/core/Fab'
import { Icon } from 'react-icons-kit'
import { plus } from 'react-icons-kit/feather/plus'

import useStyles from './styles'

function AddButton({ handleClick }) {
  const classes = useStyles()

  return (
    <Fab
      classes={{ root: classes.size }}
      size={'small'}
      color='primary'
      aria-label='add'
      onClick={handleClick}
    >
      <Icon icon={plus} size={18} />
    </Fab>
  )
}

export default AddButton
