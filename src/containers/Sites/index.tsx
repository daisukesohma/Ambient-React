import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Sites = lazy(() => import('./Sites'))

export default function SitesIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Sites />
    </Suspense>
  )
}
