/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import {
  Redirect,
  Switch,
  useLocation,
  RouteComponentProps,
} from 'react-router-dom'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import some from 'lodash/some'
// src
// import IdentitySources from 'containers/Members/IdentitySources'
// import Members from 'containers/Members'
import AccessAlarmReport from 'containers/Reports/AccessAlarmReport'
import ActivityLog from 'pages/ActivityLog'
import AnalyticsReport from 'containers/Reports/AnalyticsReport'
import Appliances from 'containers/Appliances'
import Archives from 'containers/Archives'
import ContactResources from 'features/EnhancedResponder/ContactResources'
import ContextGraph from 'pages/ContextGraph'
import Endpoints from 'containers/Endpoints'
import ExternalProfiles from 'features/EnhancedResponder/ExternalProfiles'
import Federation from 'containers/Members/IdentitySources/Federation'
import Forensics from 'pages/Forensics'
import History from 'pages/History'
import HistoryV3 from 'pages/HistoryV3'
import IdentitySourcesV2 from 'pages/UserManagement/IdentitySources'
import Jobs from 'containers/Jobs'
import LoadingScreen from 'containers/LoadingScreen'
import Nodes from 'containers/Nodes'
import OperatorPage from 'pages/OperatorPage'
import Password from 'containers/Profile/ChangePassword'
import Profile from 'containers/Profile'
import RegexMap from 'pages/ActivityLog/RegexMap'
import SecurityOperationsReport from 'containers/Reports'
import SecurityScheduler from 'containers/SecurityScheduler'
import SiteEditor from 'containers/SiteEditor'
import Sites from 'containers/Sites'
import StreamConfiguration from 'features/StreamConfiguration'
import StreamDiscoveryCreator from 'containers/StreamDiscoveryCreator'
import StreamDiscoverySelector from 'containers/StreamDiscoverySelector'
import SupportPage from 'features/SupportPage'
import ThreatResponse from 'containers/ThreatResponse'
import UserManagement from 'pages/UserManagement'
import VideoWalls from 'containers/VideoWalls'
import {
  NewSite, // Step 1
  NewNode, // Step 2
  CameraDiscoveryConfigure, // Step 3
  CameraDiscoveryStatus, // Step 4
  CameraDiscoveryActivate, // Step 5
  CameraDiscoveryComplete, // Step 6
} from 'containers/OnboardingFlow'
import JWTService from 'common/services/JWTService'
import SidebarLayout from 'layouts/SidebarLayout'
import { AuthSliceProps, verifyAccountsRequested } from 'redux/slices/auth'
import PrivateRoute from 'Router/PrivateRoute'
import SiteRoutes from 'Router/sites/SiteRoutes'

import useAccountLayoutProps from './useAccountLayoutProps'

export default function AccountRoutes({
  match: { path, params },
}: RouteComponentProps): JSX.Element {
  const account = get(params, 'account')

  const layoutProps = useAccountLayoutProps(path)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const accounts = useSelector((state: AuthSliceProps) => state.auth.accounts)
  const oldToken = useSelector((state: AuthSliceProps) => state.auth.token)
  const token = JWTService.migrateToken(oldToken)
  const [loading, setLoading] = useState(!isEmpty(token))

  // NOTE: sync accounts
  // TODO: Maybe we should verify request on if `account` changes (no need to do it on each page change)
  useEffect(() => {
    dispatch(
      verifyAccountsRequested({
        token,
        onDone: () => setLoading(false),
      }),
    )
  }, [token, dispatch, pathname])

  const hasAccess = some(accounts, { slug: account })

  if (loading) return <LoadingScreen />
  if (!hasAccess)
    return <Redirect to={{ pathname: '/404', state: { account } }} />

  return (
    <SidebarLayout {...layoutProps}>
      <Switch>
        <PrivateRoute
          path={`${path}/video-walls/streams/:streamId`}
          component={VideoWalls}
          permissions={[{ I: 'view', on: 'VideoWalls' }]}
        />
        <PrivateRoute
          path={`${path}/video-walls/:videoWallId/edit`}
          component={VideoWalls}
          permissions={[{ I: 'view', on: 'VideoWalls' }]}
        />
        <PrivateRoute
          path={`${path}/video-walls/:videoWallId`}
          component={VideoWalls}
          permissions={[{ I: 'view', on: 'VideoWalls' }]}
        />
        <PrivateRoute
          path={`${path}/video-walls`}
          component={VideoWalls}
          permissions={[{ I: 'view', on: 'VideoWalls' }]}
        />
        <PrivateRoute
          path={`${path}/history/archives`}
          component={Archives}
          permissions={[{ I: 'view', on: 'Archives' }]}
        />
        <PrivateRoute
          path={`${path}/history/activities/regex-map/:accessAlarmTypeCastId`}
          component={RegexMap}
          permissions={[{ I: 'view', on: 'Investigations' }]}
        />
        <PrivateRoute
          path={`${path}/history/activities`}
          component={ActivityLog}
          permissions={[{ I: 'view', on: 'Investigations' }]}
        />
        <PrivateRoute
          path={`${path}/history/alerts`}
          component={History}
          permissions={[{ I: 'view', on: 'Investigations' }]}
        />
        <PrivateRoute
          path={`${path}/history/alerts-v3`}
          component={HistoryV3}
          permissions={[{ I: 'view', on: 'Investigations' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/jobs/:job/stream-discovery`}
          component={StreamDiscoverySelector}
          permissions={[{ I: 'view', on: 'Infrastructure-Jobs' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites/:site/appliances/:nodeId/cameras/config`}
          component={CameraDiscoveryConfigure}
          permissions={[{ I: 'is_internal', on: 'Admin' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites/:site/appliances/:nodeId/cameras/discover`}
          component={CameraDiscoveryStatus}
          permissions={[{ I: 'is_internal', on: 'Admin' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites/:site/appliances/:nodeId/:requestId/cameras/activate`}
          component={CameraDiscoveryActivate}
          permissions={[{ I: 'is_internal', on: 'Admin' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites/:site/appliances/:nodeId/:requestId/cameras/complete`}
          component={CameraDiscoveryComplete}
          permissions={[{ I: 'is_internal', on: 'Admin' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/discovery/create`}
          component={StreamDiscoveryCreator}
          permissions={[{ I: 'view', on: 'Investigations' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites/new`}
          component={NewSite}
          permissions={[{ I: 'manage', on: 'Infrastructure-Sites' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/jobs`}
          component={Jobs}
          permissions={[{ I: 'view', on: 'Infrastructure-Jobs' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites/:site/appliances/new`}
          component={NewNode}
          permissions={[{ I: 'is_internal', on: 'Admin' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/sites`}
          component={Sites}
          permissions={[{ I: 'view', on: 'Infrastructure-Sites' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/appliances0`}
          component={Nodes}
          permissions={[{ I: 'view', on: 'Infrastructure-Nodes' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/appliances/:serialNumber`}
          component={Appliances}
          permissions={[{ I: 'view', on: 'Infrastructure-Nodes' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/appliances`}
          component={Appliances}
          permissions={[{ I: 'view', on: 'Infrastructure-Nodes' }]}
        />
        <PrivateRoute
          path={`${path}/infrastructure/cameras/stream-configuration`}
          permissions={[{ I: 'view', on: 'StreamConfiguration' }]}
          component={StreamConfiguration}
        />
        <PrivateRoute
          path={`${path}/infrastructure/cameras`}
          component={Endpoints}
          permissions={[{ I: 'view', on: 'Infrastructure-Endpoints' }]}
        />
        <PrivateRoute
          path={`${path}/dashboards/operations`}
          component={SecurityOperationsReport}
          permissions={[{ I: 'view', on: 'Reporting-Security' }]}
        />
        <PrivateRoute
          path={`${path}/dashboards/analytics`}
          component={AnalyticsReport}
          permissions={[{ I: 'view', on: 'Reporting-Analytics' }]}
        />
        <PrivateRoute
          path={`${path}/dashboards/pacs-alarms`}
          component={AccessAlarmReport}
        />
        <PrivateRoute
          path={`${path}/settings/users/select-federation`}
          component={Federation}
          permissions={[{ I: 'list_users', on: 'UserManagement' }]}
        />
        {/* TODO: Remove it with old components. Need confirmation */}
        {/* <PrivateRoute */}
        {/*   path={`${path}/settings/users/identity-sourcesv1`} */}
        {/*   component={IdentitySources} */}
        {/*   permissions={[{ I: 'list_users', on: 'UserManagement' }]} */}
        {/* /> */}
        <PrivateRoute
          path={`${path}/settings/users/identity-sources`}
          component={IdentitySourcesV2}
          permissions={[{ I: 'list_users', on: 'UserManagement' }]}
        />
        {/* TODO: Remove it with old components. Need confirmation */}
        {/* <PrivateRoute */}
        {/*   path={`${path}/settings/usersv1`} */}
        {/*   component={Members} */}
        {/*   permissions={[{ I: 'list_users', on: 'UserManagement' }]} */}
        {/* /> */}
        <PrivateRoute
          path={`${path}/settings/users`}
          component={UserManagement}
          permissions={[{ I: 'list_users', on: 'UserManagement' }]}
        />
        <PrivateRoute
          path={`${path}/settings/contact-resources`}
          component={ContactResources}
          permissions={[{ I: 'view', on: 'ContactResources' }]}
        />
        <PrivateRoute
          path={`${path}/settings/external-profiles`}
          component={ExternalProfiles}
          permissions={[{ I: 'list_users', on: 'UserManagement' }]}
        />
        <PrivateRoute
          path={`${path}/settings/profile/password`}
          component={Password}
        />
        <PrivateRoute path={`${path}/settings/profile`} component={Profile} />
        {/* TODO: need move it to /internal but add selection of accounts at first */}
        <PrivateRoute
          path={`${path}/settings/configure`}
          component={SiteEditor}
        />
        <PrivateRoute path={`${path}/support`} component={SupportPage} />
        <PrivateRoute
          path={`${path}/context/graph`}
          component={ContextGraph}
          permissions={[{ I: 'view', on: 'ContextGraph' }]}
        />
        <PrivateRoute
          path={`${path}/context/escalations/profiles`}
          component={ThreatResponse}
        />
        <PrivateRoute
          path={`${path}/context/escalations/policies/:policyId`}
          component={ThreatResponse}
          permissions={[{ I: 'view', on: 'Escalations' }]}
        />
        <PrivateRoute
          path={`${path}/context/escalations/policies`}
          component={ThreatResponse}
        />
        <PrivateRoute
          path={`${path}/context/scheduler`}
          component={SecurityScheduler}
        />
        <PrivateRoute
          path={`${path}/live`}
          component={OperatorPage}
          permissions={[{ I: 'view', on: 'OperatorPage' }]}
        />
        <PrivateRoute
          path={`${path}/forensics`}
          component={Forensics}
          permissions={[{ I: 'view', on: 'Forensics' }]}
        />
        <PrivateRoute path={`${path}/sites`} component={SiteRoutes} />

        {/* unmatched of /accounts/:account/* */}
        <Redirect to='/404' />
      </Switch>
    </SidebarLayout>
  )
}
