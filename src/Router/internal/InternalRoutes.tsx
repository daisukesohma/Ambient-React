/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Switch, RouteComponentProps, Redirect, Route } from 'react-router-dom'
// src
import AlertsInternal from 'pages/AlertsInternal'
import DataInfra from 'features/DataInfra'
import EventAnnotationPortal from 'features/EventAnnotationPortal'
import FourOhFour from 'pages/FourOhFour'
import InternalAdmin from 'features/Internal/Admin'
import Inventory from 'pages/Inventory'
import MySupportRequests from 'features/Internal/Support/MyRequests'
import PrivateRoute from 'Router/PrivateRoute'
import SidebarLayout from 'layouts/SidebarLayout'
import SkuManagement from 'pages/SkuManagement'
import Support from 'features/Internal/Support'
import SupportReview from 'features/Internal/Support/Review'
import ThreatSignatureFailureMode from 'pages/ThreatSignatureFailureMode'
import VerificationPortal from 'pages/VerificationPortal'
import DMS from 'pages/DatasetManagementTool'

import useInternalLayoutProps from './useInternalLayoutProps'

export default function InternalRoutes({
  match: { path },
}: RouteComponentProps): JSX.Element {
  const layoutProps = useInternalLayoutProps(path)

  return (
    <SidebarLayout {...layoutProps}>
      <Switch>
        {/* Root of /internal */}
        <PrivateRoute
          exact
          path={path}
          component={InternalAdmin}
          permissions={[{ I: 'view', on: 'InternalAdmin' }]}
        />

        <PrivateRoute
          path={`${path}/support/my-requests`}
          component={MySupportRequests}
          permissions={[{ I: 'request', on: 'SupportAccess' }]}
        />
        <PrivateRoute
          path={`${path}/support/review`}
          component={SupportReview}
          permissions={[{ I: 'view', on: 'SupportAccess' }]}
        />
        <PrivateRoute
          path={`${path}/support`}
          component={Support}
          permissions={[
            { I: 'view', on: 'SupportAccess' },
            { I: 'request', on: 'SupportAccess' },
          ]}
        />
        <PrivateRoute
          path={`${path}/verification-portal`}
          component={VerificationPortal}
          permissions={[{ I: 'view', on: 'VerificationPortal' }]}
        />
        <PrivateRoute
          path={`${path}/data-infrastructure/annotate/:dataPointId`}
          component={EventAnnotationPortal}
          permissions={[{ I: 'update', on: 'DataPoints' }]}
        />
        <PrivateRoute
          path={`${path}/data-infrastructure/annotate`}
          component={EventAnnotationPortal}
          permissions={[{ I: 'update', on: 'DataPoints' }]}
        />
        <PrivateRoute
          path={`${path}/data-infrastructure`}
          component={DataInfra}
          permissions={[{ I: 'view', on: 'Data Campaigns' }]}
        />
        <PrivateRoute
          path={`${path}/alerting/threat-signatures`}
          component={ThreatSignatureFailureMode}
          permissions={[{ I: 'view', on: 'VerificationPortal' }]}
        />
        <PrivateRoute
          path={`${path}/alerting/alerts`}
          component={AlertsInternal}
          permissions={[{ I: 'view', on: 'ContextGraph' }]}
        />
        <PrivateRoute
          path={`${path}/nodes/inventory`}
          component={Inventory}
          permissions={[{ I: 'view', on: 'NodeProvision' }]}
        />
        <PrivateRoute
          path={`${path}/nodes/skus`}
          component={SkuManagement}
          permissions={[{ I: 'view', on: 'Skus' }]}
        />
        <PrivateRoute
          path={`${path}/dms`}
          component={DMS}
          permissions={[{ I: 'update', on: 'DataPoints' }]}
        />
        {/* Support old urls */}
        <Redirect
          from={`${path}/data_infra/annotate`}
          to={`${path}/data-infrastructure/annotate`}
        />
        <Redirect
          from={`${path}/data_infra`}
          to={`${path}/data-infrastructure`}
        />
        <Redirect
          from={`${path}/verification`}
          to={`${path}/verification-portal`}
        />

        {/* unmatched of /internal/* */}
        <Route component={FourOhFour} />
      </Switch>
    </SidebarLayout>
  )
}
