/* eslint-disable react/jsx-props-no-spreading  */

import React from 'react'
import clsx from 'clsx'
import get from 'lodash/get'
import TextField from '@material-ui/core/TextField'

import useStyles from './styles'

interface Props {
  defaultSpacing?: boolean
  disabled?: boolean
  formikObject?: any
  id: string
  label: string
  onChange?: () => void
  placeholder?: string
  required?: boolean
  withFormik?: boolean
}

function TextFieldAmbient({
  defaultSpacing,
  disabled,
  formikObject,
  id,
  label,
  onChange,
  placeholder,
  required,
  withFormik,
}: Props): JSX.Element {
  const classes = useStyles({ darkMode: true })

  const formikProps = withFormik
    ? {
        value: get(formikObject, `values[${id}]`),
        onChange: formikObject.handleChange,
        onBlur: formikObject.handleBlur, // populates the touched object
        error:
          get(formikObject, `touched[${id}]`) &&
          Boolean(get(formikObject, `errors[${id}]`)),
        helperText:
          get(formikObject, `touched[${id}]`) &&
          get(formikObject, `errors[${id}]`),
      }
    : {}

  return (
    <div className={clsx({ [classes.textFieldSpacing]: defaultSpacing })}>
      <TextField
        disabled={disabled}
        variant='outlined'
        InputLabelProps={{
          classes: {
            outlined: classes.inputLabelOutlined,
            shrink: classes.inputLabelShrink,
            asterisk: classes.inputLabelAsterisk,
          },
          disableAnimation: false,
          variant: 'filled',
          shrink: true,
        }}
        classes={{
          root: classes.textFieldRoot,
        }}
        InputProps={{
          classes: {
            input: classes.inputBaseInput,
          },
          notched: false,
        }}
        label={label}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        id={id}
        {...formikProps}
      />
    </div>
  )
}

TextFieldAmbient.defaultProps = {
  defaultSpacing: true,
  disabled: false,
  formikObject: {},
  onChange: () => {},
  placeholder: '',
  required: false,
  withFormik: false,
}
export default TextFieldAmbient
