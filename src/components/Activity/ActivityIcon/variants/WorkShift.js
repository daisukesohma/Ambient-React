import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
// src
import UserAvatar from 'components/UserAvatar'

const propTypes = {
  activity: PropTypes.object.isRequired,
  size: PropTypes.number,
}

function WorkShiftActivityIcon({ activity, size }) {
  return (
    <UserAvatar
      img={get(activity, 'profile.img')}
      name={get(activity, 'profile.user.firstName')}
      size={size}
    />
  )
}

WorkShiftActivityIcon.propTypes = propTypes

export default WorkShiftActivityIcon
