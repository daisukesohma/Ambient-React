import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
// src
import UserAvatar from 'components/UserAvatar'

const propTypes = {
  activity: PropTypes.object.isRequired,
  size: PropTypes.number,
}

function ProfileOverrideLogActivityIcon({ activity, size }) {
  return (
    <UserAvatar
      img={get(activity, 'user.profile.img')}
      name={get(activity, 'user.firstName')}
      size={size}
    />
  )
}

ProfileOverrideLogActivityIcon.propTypes = propTypes

export default ProfileOverrideLogActivityIcon
