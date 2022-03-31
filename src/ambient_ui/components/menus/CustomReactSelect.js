/* eslint-disable */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Async from 'react-select/async'
import SelectCreatable from 'react-select/creatable'

const CustomReactSelect = ({
  options,
  isMulti,
  creatable,
  onChange,
  isAsync,
  getAsyncOptions,
  styles,
  darkMode,
  ...props
}) => {
  const { palette } = useTheme()
  const customStyles = ({ darkMode }) => ({
    control: styles => ({
      ...styles,
      backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
      borderRadius: 4,
      border: 'none',
      boxShadow: 'none',
      padding: '4px 8px',
      '&:hover': {
        border: 'none',
        boxShadow: 'none',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: styles => ({
      ...styles,
      padding: 4,
      height: 32,
    }),
    dropdownIndicator: (styles, { selectProps }) => ({
      ...styles,
      transform: selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    }),
    menu: styles => ({
      ...styles,
      boxShadow: 'none',
      borderRadius: 0,
      margin: 0,
    }),
    menuList: styles => ({
      ...styles,
      padding: 0,
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? darkMode
          ? palette.grey[800]
          : palette.grey[50]
        : isFocused
        ? darkMode
          ? palette.grey[800]
          : palette.grey[50]
        : darkMode
        ? palette.grey[900]
        : palette.common.white,
      fontWeight: isSelected || isFocused ? 900 : 300,
      fontSize: 14,
      color: darkMode ? palette.grey[100] : palette.grey[700],
      cursor: isDisabled ? 'not-allowed' : 'default',
      borderTop: `1px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
      borderBottom: `1px solid ${
        darkMode ? palette.grey[700] : palette.grey[100]
      }`,
      padding: '10px 16px',
      '&:last-child': {
        borderBottom: `2px solid ${
          darkMode ? palette.grey[700] : palette.grey[100]
        }`,
      },
      '&:first-of-type': {
        borderTop: `2px solid ${
          darkMode ? palette.grey[700] : palette.grey[100]
        }`,
      },
      ':active': {
        ...styles[':active'],
        backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
      },
    }),
    input: styles => ({
      ...styles,
      fontSize: 14,
      fontWeight: 900,
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    placeholder: styles => ({
      ...styles,
      fontSize: 14,
      fontWeight: 900,
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    singleValue: styles => ({
      ...styles,
      fontSize: 14,
      fontWeight: 900,
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    noOptionsMessage: styles => ({
      ...styles,
      backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
      color: darkMode ? palette.grey[100] : palette.grey[700],
    }),
    valueContainer: provided => ({
      ...provided,
      minWidth: 100,
      cursor: 'pointer',
      padding: '0 8px',
    }),
  })

  const handleChange = val => {
    onChange(val)
  }

  if (isAsync) {
    return (
      <Async
        {...props}
        loadOptions={getAsyncOptions}
        cacheOptions
        styles={{ ...customStyles({ darkMode }), ...styles }}
        isMulti={isMulti}
        defaultOptions
        onChange={handleChange}
      />
    )
  }

  return creatable ? (
    <SelectCreatable
      {...props}
      options={options}
      styles={{ ...customStyles({ darkMode }), ...styles }}
      isMulti={isMulti}
      onChange={handleChange}
    />
  ) : (
    <Select
      {...props}
      options={options}
      styles={{ ...customStyles({ darkMode }), ...styles }}
      isMulti={isMulti}
      onChange={handleChange}
    />
  )
}

CustomReactSelect.defaultProps = {
  isMulti: false,
  darkMode: false,
  creatable: false,
  isAsync: false,
  styles: {},
  onChange: () => {},
  getAsyncOptions: () => {},
}

CustomReactSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  isMulti: PropTypes.bool,
  darkMode: PropTypes.bool,
  creatable: PropTypes.bool,
  styles: PropTypes.object,
  isAsync: PropTypes.bool,
  onChange: PropTypes.func,
  getAsyncOptions: PropTypes.func,
}

export default CustomReactSelect
