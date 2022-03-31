import React from 'react'
import PropTypes from 'prop-types'

import { ActivityTypeEnum } from '../../../enums'

import {
  AlertEventActivityDescription,
  AccessAlarmActivityDescription,
  ProfileOverrideLogActivityDescription,
  WorkShiftActivityDescription,
} from './variants'
import ThreatSignaturePausePeriod from './variants/ThreatSignaturePausePeriod'

const propTypes = {
  activity: PropTypes.object,
  type: PropTypes.string,
  darkMode: PropTypes.bool,
  fontSizeClass: PropTypes.any,
  enableOnHover: PropTypes.bool,
}

const defaultProps = {
  activity: {},
  type: '',
  darkMode: false,
  fontSizeClass: 'am-subtitle1',
  enableOnHover: false,
}

// For CSV Download file,
// Update "getActivityDescriptionDownloadable" when descriptions change

function ActivityDescription({
  activity,
  type,
  darkMode,
  fontSizeClass,
  enableOnHover,
}) {
  if (type === ActivityTypeEnum.WorkShiftType) {
    return (
      <WorkShiftActivityDescription
        activity={activity}
        darkMode={darkMode}
        fontSizeClass={fontSizeClass}
      />
    )
  }
  if (type === ActivityTypeEnum.AlertEventType) {
    return (
      <AlertEventActivityDescription
        activity={activity}
        darkMode={darkMode}
        fontSizeClass={fontSizeClass}
      />
    )
  }
  if (type === ActivityTypeEnum.ProfileOverrideLogType) {
    return (
      <ProfileOverrideLogActivityDescription
        activity={activity}
        darkMode={darkMode}
        fontSizeClass={fontSizeClass}
      />
    )
  }
  if (type === ActivityTypeEnum.AccessAlarmType) {
    return (
      <AccessAlarmActivityDescription
        activity={activity}
        darkMode={darkMode}
        fontSizeClass={fontSizeClass}
        enableOnHover={enableOnHover}
      />
    )
  }
  if (type === ActivityTypeEnum.ThreatSignaturePausePeriodType) {
    return (
      <ThreatSignaturePausePeriod
        activity={activity}
        darkMode={darkMode}
        fontSizeClass={fontSizeClass}
      />
    )
  }
  return null
}

ActivityDescription.propTypes = propTypes
ActivityDescription.defaultProps = defaultProps

export default ActivityDescription
