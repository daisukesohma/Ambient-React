import React from 'react'
import { useSelector } from 'react-redux'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
// src
import UserAvatar from 'components/UserAvatar'

import useStyles from './styles'

export default function Name(rowData) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  return (
    <ListItem style={{ padding: 0 }}>
      <ListItemAvatar>
        <UserAvatar name={rowData.name} img={rowData.img} />
      </ListItemAvatar>
      <ListItemText
        classes={{ secondary: classes.root }}
        primary={rowData.name}
        secondary={rowData.email}
      />
    </ListItem>
  )
}
