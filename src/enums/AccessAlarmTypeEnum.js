const AccessAlarmTypeEnum = Object.freeze({
  GRANTED_ACCESS: 'Granted Access',
  GRANTED_NO_ENTRY: 'Granted: No Entry',
  INVALID_BADGE: 'Invalid Badge',
  DOOR_FORCED_OPEN: 'Door Forced Open',
  DOOR_HELD_OPEN: 'Door Held Open',
  DOOR_RESTORED: 'Door Restored',
  ACTIVE_ALARM: 'Active Alarm',
  TECHNICAL_NOTIFICATION: 'Technical Notification',
  COMMUNICATION_FAILURE: 'Communication Failure',
  OPEN_LOOP: 'Open Loop',
  OTHER: 'Other',
})

export default AccessAlarmTypeEnum
