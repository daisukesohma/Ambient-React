import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Dashboard = lazy(() => import('./Dashboard'))

export default function DashboardIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Dashboard />
    </Suspense>
  )
}
