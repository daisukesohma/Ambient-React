import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Endpoints = lazy(() => import('./Endpoints'))

export default function EndpointsIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Endpoints />
    </Suspense>
  )
}
