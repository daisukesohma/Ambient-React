import React from 'react'
import { Radio, FormControlLabel } from '@material-ui/core'

// src
import useStyles from './styles'

interface RadioButtonProps {
  value: string
  label: string
}

export default function RadioButton({
  value,
  label,
}: RadioButtonProps): JSX.Element {
  const classes = useStyles()
  return (
    <FormControlLabel
      value={value}
      control={
        <Radio
          size='small'
          color='default'
          classes={{
            root: classes.root,
            checked: classes.checked,
          }}
        />
      }
      label={label}
    />
  )
}
