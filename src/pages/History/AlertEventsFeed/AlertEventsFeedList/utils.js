import get from 'lodash/get'

import { ActivityTypeEnum } from 'enums'

const getActivityDescriptionDownloadable = (activity, type) => {
  if (activity) {
    if (type === ActivityTypeEnum.WorkShiftType) {
      return `${get(activity, 'profile.user.firstName')} ${get(
        activity,
        'profile.user.lastName',
      )} ${get(activity, 'signIn') ? 'signed in' : 'signed out'}`
    }
    if (type === ActivityTypeEnum.AlertEventType) {
      return `${get(activity, 'alert.name', 'Alert')} at ${get(
        activity,
        'stream.name',
      )} in  ${get(activity, 'stream.site.name')}`
    }
    if (type === ActivityTypeEnum.ProfileOverrideLogType) {
      return `Security profile updated from ${get(
        activity,
        'overriddenSecurityProfile.name',
        'Disabled',
      )} to ${get(
        activity,
        'overridingSecurityProfile.name',
        'Disabled',
      )} on ${get(
        activity,
        'overridingSecurityProfile.site.name',
        'Site',
      )} by ${activity.user.firstName} ${activity.user.lastName}`
    }
    if (type === ActivityTypeEnum.AccessAlarmType) {
      return `${get(activity, 'name')} at ${get(
        activity,
        'reader.stream.name',
        'stream',
      )} in ${get(activity, 'reader.site.name', 'site location')}`
    }
  }
  return null
}

const getActivityName = (activity, type) => {
  if (activity) {
    if (type === ActivityTypeEnum.AlertEventType) {
      return `${get(activity, 'alert.name')}`
    }
    if (type === ActivityTypeEnum.AccessAlarmType) {
      return `${get(activity, 'name')}`
    }
  }
  return ''
}

export { getActivityDescriptionDownloadable, getActivityName }
