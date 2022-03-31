import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import InputBase from '@material-ui/core/InputBase'
import { Icon } from 'ambient_ui'

import { useStyles } from './styles'

// FUTURE: @ERIC
// can create base text edit cell, password cell, check validation cell
//
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const theme = useTheme()
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const classes = useStyles()
  const isPasswordColumn = id === 'password'
  const [showPassword, setShowPassword] = useState(false)

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    onFocusOff()
    updateMyData(index, id, value)
  }

  const onFocus = () => {
    setIsFocused(true)
  }

  const onFocusOff = () => {
    setIsFocused(false)
  }
  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const showPasswordAdornment = (
    <div
      onClick={() => setShowPassword(!showPassword)}
      style={{ cursor: 'pointer' }}
    >
      <Icon
        icon='eye'
        color={
          showPassword ? theme.palette.primary.main : theme.palette.grey[500]
        }
      />
    </div>
  )

  // return
  return isFocused ? (
    <Input
      className={classes.margin}
      value={value}
      placeholder={id}
      onChange={onChange}
      onBlur={onBlur}
      type={isPasswordColumn && !showPassword ? 'password' : 'text'}
      endAdornment={isPasswordColumn ? showPasswordAdornment : null}
    />
  ) : (
    <InputBase
      value={value}
      className={classes.margin}
      placeholder={id}
      inputProps={{ 'aria-label': 'naked' }}
      onFocus={onFocus}
      type={isPasswordColumn && !showPassword ? 'password' : 'text'}
      endAdornment={isPasswordColumn ? showPasswordAdornment : null}
    />
  )
}

export default EditableCell

EditableCell.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.number,
  }),
  value: PropTypes.string,
  row: PropTypes.shape({
    index: PropTypes.number,
  }),
  updateMyData: PropTypes.func,
}

EditableCell.defaultProps = {
  column: null,
  value: null,
  row: null,
  updateMyData: () => {},
}
