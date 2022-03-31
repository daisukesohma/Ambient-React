import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const SecurityProfileScheduler = lazy(() =>
  import('./components/SecurityProfileScheduler'),
)

export default function SecurityProfileSchedulerIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SecurityProfileScheduler />
    </Suspense>
  )
}
