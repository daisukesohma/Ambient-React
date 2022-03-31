import React, { useEffect, useState } from 'react'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { useSelector, useDispatch } from 'react-redux'
import {
  Switch,
  Redirect,
  useParams,
  RouteComponentProps,
} from 'react-router-dom'
// src
import Dashboard from 'containers/Dashboard'
import LoadingScreen from 'containers/LoadingScreen'
import { verifySitesRequested, AuthSliceProps } from 'redux/slices/auth'

import PrivateRoute from '../PrivateRoute'

export default function SiteRoutes({
  match,
}: RouteComponentProps): JSX.Element {
  const { path, url } = match
  const dispatch = useDispatch()
  const { account }: { account: string } = useParams()
  const sites = useSelector((state: AuthSliceProps) => state.auth.sites)

  // NOTE: sync sites
  const [loading, setLoading] = useState(true)
  const firstSiteSlug = get(sortBy(sites, ['name']), [0, 'slug'])

  useEffect(() => {
    dispatch(
      verifySitesRequested({
        accountSlug: account,
        onComplete: () => {
          setLoading(false)
        },
      }),
    )
  }, [dispatch, account])

  if (loading) return <LoadingScreen />

  return (
    <Switch>
      <PrivateRoute path={`${path}/:site/live`} component={Dashboard} />
      {firstSiteSlug && (
        <Redirect exact from={url} to={`${url}/${firstSiteSlug}/live`} />
      )}
      {/* unmatched of /accounts/:account/sites/* */}
      <Redirect to='/404' />
    </Switch>
  )
}
