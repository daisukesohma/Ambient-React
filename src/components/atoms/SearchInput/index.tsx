/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import clsx from 'clsx'
import isFunction from 'lodash/isFunction'
import { Icon } from 'react-icons-kit'
import { search } from 'react-icons-kit/feather/search'
// src
import { Icons } from 'ambient_ui'

import useStyles from './styles'

const defaultProps = {
  darkMode: false,
  InputProps: {},
  className: {},
  onClear: null,
}

interface StyleProps {
  darkMode?: boolean
  onChange: () => void
  onClear?: () => void
  InputProps?: any
  className?: any
  value: string
}

function SearchInput({
  className,
  darkMode,
  InputProps,
  value,
  onChange,
  onClear,
  ...props
}: StyleProps): JSX.Element {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode })

  const endAdornment = isFunction(onClear) ? (
    <InputAdornment position='end'>
      <div className={classes.closeIcon} onClick={onClear}>
        <Icons.Close stroke={palette.grey[500]} width={24} height={24} />
      </div>
    </InputAdornment>
  ) : null

  return (
    <TextField
      className={clsx(
        classes.container,
        { [classes.darkMode]: darkMode },
        { ...className },
      )}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start' style={{ marginTop: -4 }}>
            <div className={classes.searchIcon}>
              <Icon icon={search} size={16} />
            </div>
          </InputAdornment>
        ),
        endAdornment,
        disableUnderline: true,
        placeholder: 'Search',
        className: clsx(classes.input, { [classes.darkMode]: darkMode }),
        ...InputProps,
      }}
      value={value}
      {...props}
    />
  )
}

SearchInput.defaultProps = defaultProps

export default SearchInput
