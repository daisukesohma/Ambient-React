/* eslint-disable no-nested-ternary */
import React from 'react'
import {
  Switch,
  Redirect,
  useLocation,
  RouteComponentProps,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import get from 'lodash/get'
import some from 'lodash/some'
import map from 'lodash/map'
import find from 'lodash/find'
// src
import { primaryMenus } from 'components/Sidebar/menus/account'
import { getAbilityFromPermission } from 'rbac/permissionsToAbilities'

import PrivateRoute from '../PrivateRoute'
import { AuthSliceProps } from '../../redux/slices/auth'

import AccountRoutes from './AccountRoutes'

export default function AccountsRoutes({
  match,
}: RouteComponentProps): JSX.Element {
  const { path } = match
  const accounts = useSelector((state: AuthSliceProps) => state.auth.accounts)
  const profile = useSelector((state: AuthSliceProps) => state.auth.profile)
  const firstAccountSlug = get(accounts, [0, 'slug'], null)
  const permissionList = get(profile, 'role.permissionList', [])
  const isInternal = get(profile, 'internal', false)

  const account = useLocation().pathname.replace('/accounts/', '')

  // Find the ordered list of paths from the primary menu with rbac
  const indexRedirectOptions = primaryMenus
    .map(item => {
      const rootPath = item.path
      return item.subItems
        ? map(item.subItems, subItem => {
            return {
              path: `${rootPath}/${subItem.slug}`,
              rbac: subItem.rbac,
            }
          })
        : [
            {
              path: rootPath,
              rbac: item.rbac,
            },
          ]
    })
    .flat()

  // Find the first page the user has access to
  const indexRedirectMatch = indexRedirectOptions.find(option => {
    // Check if the user has this perm
    // The check for rbac not null is because sites/ny/live etc. pages
    // have null RBAC. We never want to redirect there by default.
    return find(permissionList, dbPermission => {
      const ability = getAbilityFromPermission(dbPermission)
      // NB: NOTE that option.rbac has "actions" whereas ability has "action".
      // This is because the two files have named these fields differently event
      // though actions is not an array.
      return (
        ability &&
        option.rbac &&
        ability.subject === option.rbac.subject &&
        ability.action === option.rbac.actions
      )
    })
  })

  // If user has no permission at all: redirect to 404
  const indexRedirectPath =
    indexRedirectMatch && firstAccountSlug
      ? `${path}/${firstAccountSlug}/${indexRedirectMatch.path}`
      : '/404'

  const getAccountRedirectPath = () => {
    const accountIndex = account.indexOf('/')
    const accountSlug =
      accountIndex > 0 ? account.substring(0, accountIndex) : account

    const accountRedirectMatch = some(accounts, { slug: accountSlug })

    if (!accountRedirectMatch && isInternal)
      return { pathname: `/404`, state: { account: accountSlug } }

    return accountRedirectMatch ? `${path}/:account/live` : indexRedirectPath
  }

  // Check to see if passed account is valid
  return (
    <Switch>
      <Redirect exact from={`${path}/`} to={indexRedirectPath} />
      <Redirect exact from={`${path}/:account`} to={getAccountRedirectPath()} />
      {/* if account slug is empty */}
      <Redirect from={`${path}//`} to={indexRedirectPath} />

      <PrivateRoute path={`${path}/:account`} component={AccountRoutes} />
    </Switch>
  )
}
