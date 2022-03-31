/* eslint-disable import/no-cycle, no-param-reassign */
import { combineReducers } from '@reduxjs/toolkit'
// src
import activityLog from 'pages/ActivityLog/activityLogSlice'
import checkinModal from 'features/EnhancedResponder/CheckinModal/redux/checkinModalSlice'
import contactResources from 'features/EnhancedResponder/ContactResources/contactResourcesSlice'
import dataInfra from 'features/DataInfra/redux/dataInfraSlice'
import eventAnnotationPortal from 'features/EventAnnotationPortal/redux/eventAnnotationPortalSlice'
import externalContacts from 'features/EnhancedResponder/ExternalProfiles/externalContactsSlice'
import feed from 'components/NewsFeed/feedSlice'
import inventory from 'pages/Inventory/redux'
import securityPosturePanel from 'features/SecurityPosturePanel/securityPosturePanelSlice'
import streamConfiguration from 'features/StreamConfiguration/streamConfigurationSlice'
import login from 'pages/Login/redux/loginSlice'
import userLoginAuditLog from 'features/UserLoginAuditLog/redux/userLoginAuditLogSlice'
import userManagement from 'pages/UserManagement/redux/userManagementSlice'
import verification from 'pages/VerificationPortal/redux/verificationSlice'
import videoWallPlayer from 'components/VideoWallPlayer/videoWallPlayerSlice'
import videoWallToolbar from 'components/VideoWallToolbar/videoWallToolbarSlice'
import vmsCalendar from 'components/VideoStreamV4/components/VideoStreamControlsV2/components/ControlBar/components/Calendar/vmsCalendarSlice'
import version from 'components/organisms/NewVersionSnackbar/redux/versionSlice'
import support from 'features/SupportPage/redux/supportSlice'
import skuManagement from 'pages/SkuManagement/redux'
import internal from 'features/Internal/redux/internalSlice'
import threatSignatureFailureMode from 'pages/ThreatSignatureFailureMode/redux/threatSignatureFailureModeSlice'
import contextGraphAuditView from 'pages/ContextGraphAuditView/redux/contextGraphAuditViewSlice'
import alertsInternal from 'pages/AlertsInternal/redux/alertsInternalSlice'
import alertHistory from 'pages/History/alertHistorySlice'
import dms from 'pages/DatasetManagementTool/redux/dmsSlice'
import alertHistoryV3 from 'pages/HistoryV3/alertHistorySlice'
import pauseAlertModal from 'components/organisms/PauseAlertModal/redux/pauseAlertModalSlice'
import submitAlertModal from 'components/organisms/SubmitAlertModal/redux/submitAlertModalSlice'
import noFacialRecognitionModal from 'components/organisms/modals/NoFacialRecognitionModal/redux/noFacialRecognitionModalSlice'
import alertSnackbar from 'components/organisms/AlertSnackbar/redux/alertSnackbarSlice'

import accessAlarmDashboard from './slices/accessAlarmDashboard'
import alertModal from './slices/alertModal'
import analytics from './slices/analytics'
import appliances from './slices/appliances'
import archives from './slices/archives'
import auth from './slices/auth'
import cameras from './cameras/reducer'
import contextGraph from './contextGraph/reducer'
import demo from './demo/reducer'
import forensics from './forensics/reducer'
import investigation from './investigation/reducer'
import jobLog from './slices/jobLog'
import mobileEscalation from './mobileEscalation/reducer'
import modal from './slices/modal'
import notifications from './slices/notifications'
import operatorPage from './slices/operatorPage'
import reId from './slices/reId'
import reports from './reports/reducer'
import securityProfileSchedule from './securityProfileSchedule/reducer'
import settings from './slices/settings'
import shareLink from './slices/shareLink'
import site from './site/reducer'
import sites from './sites/reducer'
import streamDiscovery from './streamDiscovery/reducer'
import threatEscalation from './threatEscalation/reducer'
import videoStreamControls from './slices/videoStreamControls'
import videoWall from './slices/videoWall'
import vms from './vms/reducer'
import webrtc from './slices/webrtc'
import websocket from './websocket/reducer'

export default combineReducers({
  accessAlarmDashboard,
  activityLog,
  alertHistory,
  alertHistoryV3,
  alertModal,
  alertSnackbar,
  analytics,
  appliances,
  archives,
  auth,
  cameras,
  checkinModal,
  contactResources,
  contextGraph,
  contextGraphAuditView,
  dataInfra,
  demo,
  dms,
  eventAnnotationPortal,
  externalContacts,
  feed,
  forensics,
  internal,
  inventory,
  investigation,
  jobLog,
  mobileEscalation,
  modal,
  noFacialRecognitionModal,
  notifications,
  operatorPage,
  pauseAlertModal,
  reId,
  reports,
  securityPosturePanel,
  securityProfileSchedule,
  settings,
  shareLink,
  site,
  sites,
  streamConfiguration,
  login,
  skuManagement,
  streamDiscovery,
  submitAlertModal,
  support,
  threatEscalation,
  alertsInternal,
  threatSignatureFailureMode,
  userLoginAuditLog,
  userManagement,
  verification,
  videoStreamControls,
  videoWall,
  videoWallPlayer,
  videoWallToolbar,
  vms,
  version,
  vmsCalendar,
  webrtc,
  websocket,
})
