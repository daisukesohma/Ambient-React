import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'ambient_ui'
import Input from '@material-ui/core/Input'
import InputBase from '@material-ui/core/InputBase'

import { useStyles } from './styles'

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
  const isIpColumn = id === 'ip'
  const isPortColumn = id === 'port'
  const isNameColumn = id === 'name'

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    onFocusOff()
    updateMyData(index, id, value)
  }

  const isValidIpAddress = ip => {
    const validation = /((((\b|\.)(1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}(-((\b|\.)(1|2(?!5(?=6|7|8|9)|6|7|8|9))?\d{1,2}){4}|\/((1|2|3(?=1|2))\d|\d))\b)|(\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b))/g
    const isValid = ip.length > 0 && validation.exec(ip)
    return isValid
  }

  const isValidPort = port => {
    // eslint-disable-next-line
    const validation = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-6][0-9][0-9][0-9][0-9][0-9])(\,([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9]|[1-6][0-9][0-9][0-9][0-9][0-9]))*$/g
    const isValid = validation.exec(port)
    return isValid
  }

  const isValidName = name => {
    const isValid = name && name.length > 0
    return isValid
  }

  const onFocus = () => {
    setIsFocused(true)
  }

  const onFocusOff = () => {
    setIsFocused(false)
  }

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const getEndAdornment = () => {
    if ((isIpColumn || isPortColumn || isNameColumn) && isValid()) {
      return <Icon icon='checkCircle' color={theme.palette.primary.main} />
    }
    return <span style={{ width: 22 }} /> // all other columns
  }

  const isValid = () => {
    if (isIpColumn) {
      return isValidIpAddress(value)
    }
    if (isPortColumn) {
      return isValidPort(value)
    }
    if (isNameColumn) {
      return isValidName(value)
    }
    return true // all other columns
  }

  // return
  return isFocused ? (
    <Input
      endAdornment={getEndAdornment()}
      error={!isValid()}
      className={classes.margin}
      value={value}
      placeholder={id}
      onChange={onChange}
      onBlur={onBlur}
    />
  ) : (
    <InputBase
      endAdornment={getEndAdornment()}
      error={!isValid()}
      value={value}
      className={classes.margin}
      placeholder={id}
      inputProps={{ 'aria-label': 'naked' }}
      onFocus={onFocus}
    />
  )
}

export default EditableCell

EditableCell.propTypes = {
  value: PropTypes.string,
  row: PropTypes.shape({
    index: PropTypes.number,
  }),
  column: PropTypes.shape({
    id: PropTypes.number,
  }),
  updateMyData: PropTypes.func, // This is a custom function that we supplied to our table instance
  data: PropTypes.array,
}

EditableCell.defaultProps = {
  value: null,
  row: null,
  column: null,
  updateMyData: () => {},
  data: [],
}
