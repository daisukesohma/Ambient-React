import React, { useState } from 'react'
import { CheckboxWithLabel } from 'ambient_ui'
import { useSelector, useDispatch } from 'react-redux'

// This component just exposes a checkbox to allow for the sharelink to toggle params for
// the video and the alert or params for just video
//
function AlertAdjustment({ enabled, setEnabled }) {
  return (
    <CheckboxWithLabel
      onChange={() => setEnabled(!enabled)}
      label={'Share link with alert'}
      checked={enabled}
    />
  )
}

export default AlertAdjustment
