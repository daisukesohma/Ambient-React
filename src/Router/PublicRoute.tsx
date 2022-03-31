/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router-dom'

// src
import { AuthSliceProps } from '../redux/slices/auth'

interface Props extends RouteProps {
  onlyUnauthorized?: boolean
}

const defaultProps = {
  onlyUnauthorized: false,
}

function PublicRoute({ onlyUnauthorized, ...props }: Props): JSX.Element {
  const isLoggedIn = useSelector((state: AuthSliceProps) => state.auth.loggedIn)
  if (isLoggedIn && onlyUnauthorized) return <Redirect to='/accounts' />

  return <Route {...props} />
}

PublicRoute.defaultProps = defaultProps

export default PublicRoute
