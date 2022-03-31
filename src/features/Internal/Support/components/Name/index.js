import React from 'react'
import clsx from 'clsx'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { useSelector } from 'react-redux'

import UserAvatar from '../../../../../components/UserAvatar'

import { useStyles } from './styles'

const Name = rowData => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  return (
    <ListItem style={{ padding: 0 }}>
      <ListItemAvatar>
        <UserAvatar name={rowData.name} img={rowData.img} />
      </ListItemAvatar>
      <ListItemText
        classes={{
          primary: clsx({
            [classes.root]: !rowData.isExpired,
            [classes.expired]: rowData.isExpired,
          }),
          secondary: clsx({
            [classes.root]: !rowData.isExpired,
            [classes.expired]: rowData.isExpired,
          }),
        }}
        primary={rowData.name}
        secondary={rowData.email}
      />
    </ListItem>
  )
}

export default Name
