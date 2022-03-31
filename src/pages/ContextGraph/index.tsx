import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const ContextGraph = lazy(() => import('./ContextGraph'))

export default function ContextGraphIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ContextGraph />
    </Suspense>
  )
}
