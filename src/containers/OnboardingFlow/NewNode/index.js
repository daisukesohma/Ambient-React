import React from 'react'

import OnboardingStepper from '../OnboardingStepper'
import { containerStyle } from '../common/styles'

import NodeForm from './NodeForm'

export default function NewNode() {
  return (
    <div style={containerStyle.appContainer}>
      <OnboardingStepper step={1} showNavigation={false} />
      <div style={containerStyle.formContainer}>
        <NodeForm />
      </div>
    </div>
  )
}
