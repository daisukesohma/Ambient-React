import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { TextField, InputAdornment } from '@material-ui/core'
import { Icon } from 'react-icons-kit'
import { search } from 'react-icons-kit/feather/search'
import clsx from 'clsx'

import { Icons } from 'ambient_ui'
import useStyles from './styles'

const { Close } = Icons

const SearchInput = ({
  className,
  InputProps,
  isClearShown,
  value,
  onChange,
  onClear,
}) => {
  const { palette } = useTheme()
  const classes = useStyles()

  return (
    <TextField
      id='search-bar'
      className={clsx(classes.container, { ...className })}
      onChange={onChange}
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
            <div className={classes.closeIcon} onClick={onClear}>
              <Close stroke={palette.grey[500]} width={24} height={24} />
            </div>
          </InputAdornment>
        ) : null,
        disableUnderline: true,
        placeholder: 'Search',
        className: classes.input,
        ...InputProps,
      }}
      value={value}
    />
  )
}

SearchInput.defaultProps = {
  className: null,
  InputProps: null,
  isClearShown: false,
  onChange: () => {},
  defaultValue: '',
}

SearchInput.propTypes = {
  className: PropTypes.string,
  isClearShown: PropTypes.bool,
  InputProps: PropTypes.object,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
}

export default SearchInput
