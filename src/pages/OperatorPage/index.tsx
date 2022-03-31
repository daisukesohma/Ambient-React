import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const OperatorPage = lazy(() => import('./OperatorPage'))

export default function OperatorPageIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OperatorPage />
    </Suspense>
  )
}
