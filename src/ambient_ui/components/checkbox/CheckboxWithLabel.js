import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// src
import Checkbox from './Checkbox'

function CheckboxWithLabel({
  checked,
  onChange,
  label,
  CheckboxProps,
  FormControlLabelProps,
}) {
  return (
    <FormControlLabel
      classes={{
        label: 'am-subtitle2',
      }}
      control={
        <Checkbox
          checked={checked}
          onChange={() => onChange()}
          name={label}
          disableRipple
          {...CheckboxProps}
        />
      }
      label={label}
      {...FormControlLabelProps}
    />
  )
}

export default CheckboxWithLabel
