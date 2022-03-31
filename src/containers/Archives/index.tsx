import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Archives = lazy(() => import('./Archives'))

export default function ArchivesIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Archives />
    </Suspense>
  )
}
