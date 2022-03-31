import React from 'react'

import OnboardingStepper from '../../OnboardingStepper'
import { containerStyle } from '../../common/styles'

import CameraDiscoveryComplete from './CameraDiscoveryComplete'

export default function CameraDiscoveryCompleteComponent() {
  return (
    <div style={containerStyle.appContainer}>
      <OnboardingStepper step={5} showNavigation={false} />
      <CameraDiscoveryComplete />
    </div>
  )
}
