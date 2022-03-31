import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import clsx from 'clsx'
import { Icon } from 'react-icons-kit'
import { search } from 'react-icons-kit/feather/search'

import Icons from '../icons'
import useStyles from './styles'

const { Close } = Icons

const SearchInput = ({
  className,
  InputProps,
  isClearShown,
  onChange,
  defaultValue,
  darkMode,
  ...props
}) => {
  const { palette } = useTheme()
  const classes = useStyles()

  const [inputValue, setInputValue] = useState(defaultValue || '')

  const handleChange = event => {
    const { value } = event.target
    setInputValue(value)
    onChange(value)
  }

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <TextField
      id='search-bar'
      className={clsx(classes.container, { ...className })}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start' style={{ marginTop: -4 }}>
            <div className={classes.searchIcon}>
              <Icon icon={search} size={16} />
            </div>
          </InputAdornment>
        ),
        endAdornment: isClearShown ? (
          <InputAdornment position='end'>
            <div className={classes.closeIcon} onClick={handleClear}>
              <Close stroke={palette.grey[500]} width={24} height={24} />
            </div>
          </InputAdornment>
        ) : null,
        disableUnderline: true,
        placeholder: 'Search',
        className: classes.input,
        ...InputProps,
      }}
      value={inputValue}
      {...props}
    />
  )
}

SearchInput.defaultProps = {
  className: null,
  InputProps: null,
  isClearShown: false,
  darkMode: false,
  onChange: () => {},
  defaultValue: '',
}

SearchInput.propTypes = {
  className: PropTypes.string,
  isClearShown: PropTypes.bool,
  darkMode: PropTypes.bool,
  InputProps: PropTypes.object,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
}

export default SearchInput
