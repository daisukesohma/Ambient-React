const WebRTCMessageTypeEnum = Object.freeze({
  // Signal types sent over signal server
  REQUEST_STREAM: 'requeststream',
  HANG_UP: 'hangup',
  ARCHIVAL: 'archival',
  EXPORT: 'export',
  ERROR: 'error',
  NEW_TRACK_ID: 'newtrackid',
  // OWT event types, but not technically sent over signal server
  STREAM_ADDED: 'streamadded',
  ENDED: 'ended',
  IAMALIVE: 'iamalive',
  SYNC: 'sync',
})

export default WebRTCMessageTypeEnum
