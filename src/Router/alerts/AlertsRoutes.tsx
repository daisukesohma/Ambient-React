/* eslint-disable no-nested-ternary */
import React from 'react'
import { Switch, RouteComponentProps, Redirect } from 'react-router-dom'
// src
import Acknowledgement from 'containers/AlertMobile/Acknowledgement'
import Dispatch from 'containers/AlertMobile/Dispatch'
import Share from 'containers/AlertMobile/Share'
import Verification from 'containers/AlertMobile/Verification'
import MobileLayout from 'layouts/MobileLayout'
import PublicRoute from 'Router/PublicRoute'

export default function AlertsRoutes({
  match: { path },
}: RouteComponentProps): JSX.Element {
  return (
    <MobileLayout>
      <Switch>
        <PublicRoute
          path={`${path}/events/acknowledge/:alertEventId/:alertEventHash/:escalationLevelId/:escalationContactId`}
          component={Acknowledgement}
        />
        <PublicRoute
          path={`${path}/dispatch/:alertEventId/:alertEventHash/:userId`}
          component={Dispatch}
        />
        <PublicRoute path={`${path}/share/:token`} component={Share} />
        <PublicRoute
          path={`${path}/verify/:alertInstanceId/:alertInstanceHash/:userId`}
          component={Verification}
        />

        {/* unmatched of /alerts/* */}
        <Redirect to='/404' />
      </Switch>
    </MobileLayout>
  )
}
