const MixPanelEventEnum = {
  AUTH_LOGIN: 'Auth/LogIn',
  AUTH_LOGOUT: 'Auth/LogOut',

  FORENSICS_ENTER: 'Forensics/Enter',
  FORENSICS_EXIT: 'Forensics/Exit',
  FORENSICS_SEARCH: 'Forensics/Search',

  LIVE_ENTER: 'Live/Enter',
  LIVE_EXIT: 'Live/Exit',
  // Alert Events
  ALERT_RESOLVED: 'Alert/Resolved',
  ALERT_DISMISSED: 'Alert/Dismissed',
  ALERT_DISPATCH: 'Alert/Dispatch',
  ALERT_DISPATCH_ALL: 'Alert/DispatchAll',
  ALERT_SHARE: 'Alert/Share',

  ALERT_RECALL: 'Alert/Recall',
  ALERT_REPORT: 'Alert/Report',
  ALERT_PAUSE: 'Alert/Pause',

  COMMENT_CREATE: 'Comment/Create',
  // COMMENT_EDIT: 'Comment/Edit',
  // COMMENT_DELETE: 'Comment/Delete',

  // INVENTORY
  INVENTORY_ASSOCIATE_NODE_TO_ACCOUNT: 'Inventory/AssociateNodeToAccount',
  INVENTORY_DOWNLOAD_ISO: 'Inventory/DownloadIso',

  SECURITY_OPERATIONAL_REPORT_ENTER: 'SecurityOperationalReport/Enter',
  SECURITY_OPERATIONAL_REPORT_SITE_FILTER_UPDATE:
    'SecurityOperationalReport/SiteFilterUpdate',

  ANALYTICS_ENTER: 'Analytics/Enter',
  ANALYTICS_DASHBOARD_FILTER_UPDATE: 'Analytics/DashboardFilterUpdate',

  // Alex Leontev new events [https://ambient-ai.atlassian.net/browse/AMB-545]
  VIDEO_WALL_OPENED: 'VideoWall/Opened',
  VIDEO_WALL_CREATED: 'VideoWall/Created',
  VIDEO_WALL_UPDATED: 'VideoWall/Updated',
  VIDEO_WALL_ROTATED: 'VideoWall/Rotated',

  VMS_OPENED: 'VMS/Opened', // account and site
  VMS_CLOSED: 'VMS/Closed', // account and site
  VMS_CALENDAR_CHANGED: 'VMS/Calendar/Changed', // account and site
  VMS_SHORTCUTS_INSTRUCTIONS_OPENED: 'VMS/ShortcutsInstructions/Opened', // account and site
  VMS_SHARING_OPENED: 'VMS/Sharing/Opened', // account and site
  VMS_MOTIONS_OPENED: 'VMS/Motions/Opened', // account and site
  VMS_FORENSICS_OPENED: 'VMS/Forensics/Opened', // account and site

  VMS_FRAME_PREVIOUS: 'VMS/Frame/Previous', // account and site
  VMS_FRAME_PLAY_PAUSE: 'VMS/Frame/PlayPause', // account and site
  VMS_FRAME_NEXT: 'VMS/Frame/Next', // account and site
  VMS_FRAME_MOVED_10_SECONDS: 'VMS/Frame/Moved10Seconds', // account and site

  VMS_ARCHIVE_EXPORTED: 'VMS/Archive/Exported', // account and site
  VMS_CUSTOM_ALERT_CREATED: 'VMS/CustomAlert/Created',
  VMS_TIME_RANGE_CHANGED: 'VMS/TimeRange/Changed', // account and site

  VMS_SIDEBAR_ALERT_DETAILS_OPENED: 'VMS/Sidebar/AlertDetails/Opened', // account and site
  VMS_SIDEBAR_TIMELINE_OPENED: 'VMS/Sidebar/Timeline/Opened', // account and site
  VMS_SIDEBAR_RESPONDERS_OPENED: 'VMS/Sidebar/Responders/Opened', // account and site

  VMS_PEER_CONNECTION_BLACKLIST: 'VMS/PeerConnection/Blacklist', // account and site
  VMS_PEER_CONNECTION_RETRY: 'VMS/PeerConnection/Retry', // account and site
  VMS_PEER_CONNECTION_RESET: 'VMS/PeerConnection/Reset', // account and site
  VMS_BSOD: 'VMS/BSOD', // account and site
  VMS_STREAM_REQUESTED: 'VMS/Requested', // requested a stream
  VMS_STREAM_PLAYING: 'VMS/Playing', // Media began playing, includes latency in ms
  VMS_STREAM_FALLBACK_TO_LIVE: 'VMS/FallbackToLive', // Recorded
  VMS_ENTITY_SEARCH: 'VMS/EntitySearch',
}

export default MixPanelEventEnum
