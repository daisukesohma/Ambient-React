import React from 'react'
import PropTypes from 'prop-types'
// src
import { ActivityTypeEnum } from 'enums'

import {
  AccessAlarmActivityIcon,
  ProfileOverrideLogActivityIcon,
  WorkShiftActivityIcon,
} from './variants'

const propTypes = {
  activity: PropTypes.object,
  type: PropTypes.string,
}

function ActivityIcon({ activity, type, ...restProps }) {
  if (type === ActivityTypeEnum.AccessAlarmType) {
    return <AccessAlarmActivityIcon {...restProps} />
  }
  if (type === ActivityTypeEnum.ProfileOverrideLogType) {
    return <ProfileOverrideLogActivityIcon activity={activity} {...restProps} />
  }
  if (type === ActivityTypeEnum.WorkShiftType) {
    return <WorkShiftActivityIcon activity={activity} {...restProps} />
  }
  return null
}

ActivityIcon.propTypes = propTypes

export default ActivityIcon
