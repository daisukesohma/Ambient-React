import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import UserAvatar from 'components/UserAvatar'

const Name = rowData => {
  return (
    <ListItem style={{ padding: 0 }}>
      <ListItemAvatar>
        <UserAvatar name={rowData.name} img={rowData.img} />
      </ListItemAvatar>
      <ListItemText primary={rowData.name} secondary={rowData.email} />
    </ListItem>
  )
}

export default Name
