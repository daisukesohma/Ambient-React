import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const ThreatResponse = lazy(() => import('./ThreatResponse'))

export default function ThreatResponseIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ThreatResponse />
    </Suspense>
  )
}
