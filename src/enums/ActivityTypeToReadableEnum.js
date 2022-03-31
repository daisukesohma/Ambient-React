import ActivityTypeEnum from './ActivityTypeEnum'

const ActivityTypeToReadableEnum = Object.freeze({
  [ActivityTypeEnum.AlertEventType]: 'Alert Event',
  [ActivityTypeEnum.AccessAlarmType]: 'Access Alarm',
  [ActivityTypeEnum.ProfileOverrideLogType]: 'Security Profile',
  [ActivityTypeEnum.WorkShiftType]: 'Work Shift',
  [ActivityTypeEnum.ThreatSignaturePausePeriodType]:
    'Threat Signature Pause Period',
})

export default ActivityTypeToReadableEnum
