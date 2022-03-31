import React from 'react'

import OnboardingStepper from '../OnboardingStepper'
import { containerStyle } from '../common/styles'

import SiteForm from './SiteForm'

export default function NewSite() {
  return (
    <div style={containerStyle.appContainer}>
      <OnboardingStepper step={0} showNavigation={false} />
      <div style={containerStyle.formContainer}>
        <SiteForm />
      </div>
    </div>
  )
}
