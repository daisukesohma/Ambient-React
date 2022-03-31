import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import UserAvatar from '../../../../../components/UserAvatar'

import useStyles from './styles'

const defaultProps = {
  user: null,
  darkMode: false,
}

const propTypes = {
  user: PropTypes.object,
  darkMode: PropTypes.bool,
}

const Profile = ({ user, darkMode }) => {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })
  const name = `${get(user, 'firstName')} ${get(user, 'lastName')}`
  return (
    <ListItem
      style={{
        padding: 0,
        color: darkMode ? palette.common.white : palette.common.black,
      }}
    >
      <ListItemAvatar>
        <UserAvatar name={name} img={get(user, 'profile.img')} />
      </ListItemAvatar>
      <ListItemText
        classes={{ root: classes.listItem, secondary: classes.listItem }}
        primary={name}
        secondary={get(user, 'email')}
      />
    </ListItem>
  )
}

Profile.propTypes = propTypes
Profile.defaultProps = defaultProps

export default Profile
