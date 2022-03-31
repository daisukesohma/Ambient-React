/*
 * author: aleks@ambient.ai
 * BE AWARE: Order of routes matters. This is a switch statement.
 * It is recommended you order more deeply pathed routers first!
 * You should also generally place Redirects at the end
 */
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
// src
import ApplicationLayout from 'layouts/ApplicationLayout'
import ForgotPassword from 'pages/ForgotPassword'
import VerifyPhone from 'pages/VerifyPhone'
import FourOhFour from 'pages/FourOhFour'
import IdentitySourceLanding from 'containers/IdentitySourceLanding'
import Logout from 'pages/Logout'
import Share from 'containers/Share'
import Login from 'pages/Login'
import ResetPassword from 'pages/ResetPassword'
import Signup from 'pages/Signup'
import SSOLandingScreen from 'containers/SSOLandingScreen'

import SwitchAccount from '../pages/SwitchAccount'

import AccountsRoutes from './accounts/AccountsRoutes'
import AlertsRoutes from './alerts/AlertsRoutes'
import InternalRoutes from './internal/InternalRoutes'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

export default function AppRouter(): JSX.Element {
  return (
    <ApplicationLayout>
      <Switch>
        {/* Routes only for unauthorized users */}
        <PublicRoute
          onlyUnauthorized
          path='/invites/:inviteCode'
          component={ResetPassword}
        />
        <PublicRoute
          onlyUnauthorized
          path='/invites'
          component={ResetPassword}
        />
        <PublicRoute
          onlyUnauthorized
          path='/forgot-password'
          component={ForgotPassword}
        />
        <PublicRoute
          onlyUnauthorized
          path='/verify-phone'
          component={VerifyPhone}
        />
        <PublicRoute onlyUnauthorized path='/login' component={Login} />
        <PublicRoute onlyUnauthorized path='/signup' component={Signup} />
        <PublicRoute
          onlyUnauthorized
          path='/sso-authentication/:token'
          component={SSOLandingScreen}
        />

        {/* Routes for authorized and unauthorized users */}
        <PublicRoute path='/alerts' component={AlertsRoutes} />

        {/* Routes for authorized users */}
        <PrivateRoute
          path='/identity-source-landing'
          component={IdentitySourceLanding}
        />
        <PrivateRoute path='/accounts' component={AccountsRoutes} />
        {/* NOTE: "/internal/admin" - only temporary support for Backward compatible. After month we can left only "/internal" */}
        <PrivateRoute
          path={['/internal/admin', '/internal']}
          component={InternalRoutes}
        />
        <PrivateRoute path='/share' component={Share} />
        <PrivateRoute path='/select-account' component={SwitchAccount} />
        <PrivateRoute path='/logout' component={Logout} />

        {/* Support old urls */}
        <Redirect from='/verification' to='/internal/verification-portal' />
        <Redirect
          from='/identity_source_landing'
          to='/identity-source-landing'
        />

        {/* Root Router */}
        <PublicRoute onlyUnauthorized exact path='/' component={Login} />

        {/* Unmatched Router */}
        <Route component={FourOhFour} />
      </Switch>
    </ApplicationLayout>
  )
}
