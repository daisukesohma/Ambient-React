import { all } from 'redux-saga/effects'
// src
import activityLog from 'pages/ActivityLog/saga'
import checkinModal from 'features/EnhancedResponder/CheckinModal/saga'
import contactResources from 'features/EnhancedResponder/ContactResources/sagas'
import dataInfra from 'features/DataInfra/saga'
import eventAnnotationPortal from 'features/EventAnnotationPortal/saga'
import externalContacts from 'features/EnhancedResponder/ExternalProfiles/sagas'
import feed from 'components/NewsFeed/saga'
import version from 'components/organisms/NewVersionSnackbar/sagas'
import securityPosturePanel from 'features/SecurityPosturePanel/sagas'
import streamConfiguration from 'features/StreamConfiguration/sagas'
import support from 'features/SupportPage/saga'
import login from 'pages/Login/sagas'
import userLoginAuditLog from 'features/UserLoginAuditLog/sagas'
import userManagement from 'pages/UserManagement/sagas'
import verification from 'pages/VerificationPortal/saga'
import internal from 'features/Internal/sagas'
import threatSignatures from 'pages/ThreatSignatureFailureMode/saga/index'
import inventory from 'pages/Inventory/saga'
import skuManagement from 'pages/SkuManagement/saga'
import contextGraphAuditViewSaga from 'pages/ContextGraphAuditView/saga/index'
import alertsInternal from 'pages/AlertsInternal/saga/index'
import alertHistory from 'pages/History/saga/index'
import dms from 'pages/DatasetManagementTool/saga/index'
import alertHistoryV3 from 'pages/HistoryV3/saga/index'
import pauseAlertModal from 'components/organisms/PauseAlertModal/sagas'
import submitAlertModal from 'components/organisms/SubmitAlertModal/sagas'

import access from './access'
import accessAlarmDashboard from './accessAlarmDashboard'
import alertModal from './alertModal'
import analytics from './analytics'
import appliances from './appliances'
import archives from './archives'
import auth from './auth'
import cameras from './cameras'
import contextGraph from './contextGraph'
import forensics from './forensics'
import jobLog from './jobLog'
import modal from './modal'
import mobileEscalation from './mobileEscalation'
import operatorPage from './operatorPage'
import reId from './reId'
import reports from './reports'
import securityProfileSchedule from './securityProfileSchedule'
import site from './site'
import sites from './sites'
import streamDiscovery from './streamDiscovery'
import threatEscalation from './threatEscalation'
import videoStreamControls from './videoStreamControls'
import videoWall from './videoWall'
import videoWallPlayer from './videoWallPlayer'
import videoWallToolbar from './videoWallToolbar'
import vmsCalendar from './vmsCalendar'
import webrtc from './webrtc'

function* rootSaga() {
  yield all([
    access(),
    accessAlarmDashboard(),
    activityLog(),
    alertHistory(),
    alertHistoryV3(),
    alertModal(),
    analytics(),
    appliances(),
    archives(),
    auth(),
    cameras(),
    checkinModal(),
    contactResources(),
    contextGraph(),
    contextGraphAuditViewSaga(),
    dataInfra(),
    dms(),
    eventAnnotationPortal(),
    externalContacts(),
    feed(),
    forensics(),
    internal(),
    inventory(),
    jobLog(),
    mobileEscalation(),
    modal(),
    operatorPage(),
    pauseAlertModal(),
    reId(),
    reports(),
    securityPosturePanel(),
    securityProfileSchedule(),
    site(),
    sites(),
    skuManagement(),
    streamConfiguration(),
    streamDiscovery(),
    submitAlertModal(),
    support(),
    login(),
    threatEscalation(),
    threatSignatures(),
    alertsInternal(),
    userLoginAuditLog(),
    userManagement(),
    verification(),
    version(),
    videoStreamControls(),
    videoWall(),
    videoWallPlayer(),
    videoWallToolbar(),
    vmsCalendar(),
    webrtc(),
  ])
}

export default rootSaga
