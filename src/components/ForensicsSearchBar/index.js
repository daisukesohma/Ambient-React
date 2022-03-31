import React from 'react'
import PropTypes from 'prop-types'
import match from 'autosuggest-highlight/match'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Icon } from 'react-icons-kit'
import { search } from 'react-icons-kit/feather/search'
import { clock } from 'react-icons-kit/feather/clock'
import get from 'lodash/get'
import clsx from 'clsx'
import parse from 'autosuggest-highlight/parse'
import { useTheme } from '@material-ui/core/styles'
// src
import useStyles from './styles'

const propTypes = {
  darkMode: PropTypes.bool,
  handleChange: PropTypes.func,
  isMobileOnly: PropTypes.bool,
  options: PropTypes.array,
  selectedSuggestion: PropTypes.object,
  willExpandWidth: PropTypes.bool,
}

const defaultProps = {
  willExpandWidth: true,
}

function ForensicsSearchBar({
  darkMode,
  handleChange,
  isMobileOnly,
  options,
  selectedSuggestion,
  willExpandWidth = true,
}) {
  const { palette } = useTheme()
  const classes = useStyles({ darkMode, isMobileOnly, willExpandWidth })

  return (
    <Autocomplete
      freeSolo
      id='suggestion-search'
      classes={{
        root: classes.root,
        focused: willExpandWidth ? classes.focused : null,
        option: classes.option,
        listbox: classes.popperRoot,
      }}
      groupBy={option => option.isHistory}
      options={options}
      value={selectedSuggestion}
      getOptionLabel={option => get(option, 'params.name', '')}
      onChange={handleChange}
      renderInput={params => {
        return (
          <TextField
            className={clsx(classes.container, {
              // [classes.darkMode]: darkMode,
            })}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position='start' style={{ marginTop: -4 }}>
                  <div className={classes.searchIcon}>
                    <Icon icon={search} size={16} />
                  </div>
                </InputAdornment>
              ),
              disableUnderline: true,
              placeholder: 'Search',
              className: clsx(classes.input, {
                // [classes.darkMode]: darkMode,
              }),
            }}
          />
        )
      }}
      renderOption={(option, state) => {
        // NOTE: matches from this library are only from start of word.
        const matches = match(option.params.name, state.inputValue)
        const parts = parse(option.params.name, matches)

        return (
          <div className={classes.optionRoot}>
            <span
              className={classes.searchIcon}
              style={{ marginLeft: -16, marginRight: 8 }}
            >
              {option.isHistory ? (
                <Icon icon={clock} size={12} />
              ) : (
                <Icon icon={search} size={12} />
              )}
            </span>
            <span>
              {parts.map((part, index) => (
                <span
                  key={`${option.params.name}-highlight-${index}`}
                  style={{
                    fontWeight: part.highlight ? '400' : `700 !important`,
                    color: palette.text.primary,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </span>
          </div>
        )
      }}
    />
  )
}

ForensicsSearchBar.defaultProps = defaultProps
ForensicsSearchBar.propTypes = propTypes

export default ForensicsSearchBar
