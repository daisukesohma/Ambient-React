import React from 'react'

import OnboardingStepper from '../../OnboardingStepper'
import { containerStyle } from '../../common/styles'

import CameraDiscoveryStatus from './CameraDiscoveryStatus'

export default function Status() {
  return (
    <div style={containerStyle.appContainer}>
      <OnboardingStepper step={3} showNavigation={false} />
      <div style={containerStyle.tableContainer}>
        <CameraDiscoveryStatus />
      </div>
    </div>
  )
}
