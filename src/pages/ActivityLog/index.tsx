import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const ActivityLog = lazy(() => import('./ActivityLog'))

export default function ActivityLogIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ActivityLog />
    </Suspense>
  )
}
