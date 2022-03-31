import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const Forensics = lazy(() => import('./Forensics'))

export default function ForensicsIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Forensics />
    </Suspense>
  )
}
