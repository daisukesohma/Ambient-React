import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const History = lazy(() => import('./History'))

export default function HistoryIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <History />
    </Suspense>
  )
}
