import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import { IconButton } from '@material-ui/core'
import throttle from 'lodash/throttle'
import isUndefined from 'lodash/isUndefined'

import useStyles from './styles'

const propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func,
  placeholder: PropTypes.string,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  search: '',
  setSearch: () => {},
  placeholder: 'Search',
  darkMode: undefined, // default needs to be null or undefined
}

function ToolbarSearch({ search, setSearch, darkMode, placeholder }) {
  const { palette } = useTheme()
  const darkModeSetting = useSelector(state => state.settings.darkMode)
  const classes = useStyles({
    darkMode: isUndefined(darkMode) ? darkModeSetting : darkMode,
  })
  const dispatch = useDispatch()

  const handleSearch = event => {
    dispatch(setSearch({ search: event.target.value }))
  }

  const tHandleSearch = throttle(handleSearch, 16, { leading: true })

  const clearSearch = () => {
    dispatch(setSearch({ search: '' }))
  }

  return (
    <TextField
      fullWidth
      autoComplete='off'
      InputProps={{
        className: classes.searchInput,
        startAdornment: (
          <InputAdornment position='start'>
            <Icons.Investigate
              width={24}
              height={24}
              stroke={palette.grey[500]}
            />
          </InputAdornment>
        ),
        endAdornment: search ? (
          <InputAdornment position='end'>
            <IconButton aria-label='Clear search' onClick={clearSearch}>
              <Icons.Close width={24} height={24} stroke={palette.grey[500]} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      name='search'
      placeholder={placeholder}
      value={search}
      onChange={tHandleSearch}
    />
  )
}

ToolbarSearch.propTypes = propTypes
ToolbarSearch.defaultProps = defaultProps

export default ToolbarSearch
