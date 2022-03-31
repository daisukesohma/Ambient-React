/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import includes from 'lodash/includes'
import some from 'lodash/some'
import isEmpty from 'lodash/isEmpty'
// src
import { getPermissionFromAbility } from 'rbac/permissionsToAbilities'
import { AuthSliceProps } from 'redux/slices/auth'

interface Props extends RouteProps {
  permissions?: Array<{ I: string; on: string }>
}

const defaultProps = {
  permissions: [],
}

function PrivateRoute({ permissions, ...props }: Props): JSX.Element {
  const isLoggedIn = useSelector((state: AuthSliceProps) => state.auth.loggedIn)
  const userPermissions = useSelector(
    (state: AuthSliceProps) => state.auth.profile.role.permissionList,
  )

  // NOTE: without permissions, we check only the authorization of the user
  const hasAccess =
    isEmpty(permissions) ||
    some(permissions, ({ I, on }) =>
      includes(
        userPermissions,
        getPermissionFromAbility({ action: I, subject: on }),
      ),
    )

  if (!isLoggedIn) return <Redirect to='/login' />
  if (!hasAccess) return <Redirect to='/404' />

  return <Route {...props} />
}

PrivateRoute.defaultProps = defaultProps

export default PrivateRoute
