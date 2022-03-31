import React from 'react'

import OnboardingStepper from '../../OnboardingStepper'
import { containerStyle } from '../../common/styles'

import CameraDiscoveryActivate from './CameraDiscoveryActivate'

export default function Activate() {
  return (
    <div style={containerStyle.appContainer}>
      <OnboardingStepper step={4} showNavigation={false} />
      <div style={containerStyle.tableContainer}>
        <CameraDiscoveryActivate />
      </div>
    </div>
  )
}
