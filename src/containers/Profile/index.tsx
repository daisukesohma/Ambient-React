import React, { lazy, Suspense } from 'react'
// src
import LoadingScreen from 'containers/LoadingScreen'

const ProfileContainer = lazy(() => import('./ProfileContainer'))

export default function ProfileContainerIndex(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProfileContainer />
    </Suspense>
  )
}
