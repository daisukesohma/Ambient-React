import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Appliances = lazy(() => import('./Appliances'))

export default function AppliancesIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Appliances />
    </Suspense>
  )
}
