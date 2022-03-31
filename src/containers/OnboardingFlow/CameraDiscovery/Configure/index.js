import React from 'react'

import OnboardingStepper from '../../OnboardingStepper'
import { containerStyle } from '../../common/styles'

import CameraContainer from './CameraContainer'

export default function CameraDiscoveryConfigure() {
  return (
    <div style={containerStyle.appContainer}>
      <OnboardingStepper step={2} showNavigation={false} />
      <div style={containerStyle.formWideContainer}>
        <CameraContainer />
      </div>
    </div>
  )
}
