import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(({ spacing, palette }) => ({
  textField: {
    marginLeft: spacing(1),
    marginRight: spacing(1),
  },
  disabledLabel: {
    display: 'none',
  },
  disabledInput: {
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: 4,
    '& .MuiOutlinedInput-notchedOutline': {
      display: 'none',
    },
    '&.MuiInputBase-formControl': {
      border: 'none',
    },
  },
}))

// TODO: WARNING! This component doesn't handle value property from parent components. So you can't clear the state for example.
// TODO: Need just use MaterialUI Theme or if you override it, pls, use all original props and just override classes.

const TextInput = ({
  label,
  placeholder,
  helperText,
  error,
  disabled,
  onChange,
}) => {
  const classes = useStyles()

  const [value, setValue] = useState('')

  const handleChange = event => {
    setValue(event.target.value)
  }

  useEffect(() => {
    onChange(value)
  }, [value, onChange])

  return (
    <TextField
      disabled={disabled}
      error={error}
      label={label}
      placeholder={placeholder}
      className={classes.textField}
      helperText={helperText}
      margin='normal'
      variant='outlined'
      value={value}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
        classes: {
          disabled: classes.disabledLabel,
        },
      }}
      InputProps={{
        classes: {
          disabled: classes.disabledInput,
        },
      }}
    />
  )
}

TextInput.defaultProps = {
  label: '',
  placeholder: '',
  helperText: '',
  error: false,
  disabled: false,
  onChange: () => {},
}

TextInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}

export default TextInput
