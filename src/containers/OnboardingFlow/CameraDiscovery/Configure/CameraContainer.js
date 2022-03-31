import React, { useState } from 'react'

import CameraIpForm from './CameraIpForm'
import CameraCredentialsForm from './CameraCredentialsForm'

function CameraContainer(props) {
  const [showIPForm, setShowIPForm] = useState(true)
  const [showCredentialsForm, setShowCredentialsForm] = useState(false)
  const [formValues, setFormValues] = useState({})

  const switchFormWithData = data => () => {
    setFormValues(data)
    setShowIPForm(false)
    setShowCredentialsForm(true)
  }

  return (
    <>
      {showIPForm && (
        <CameraIpForm {...props} handleNext={switchFormWithData} />
      )}
      {showCredentialsForm && (
        <CameraCredentialsForm {...props} formValues={formValues} />
      )}
    </>
  )
}

export default CameraContainer
