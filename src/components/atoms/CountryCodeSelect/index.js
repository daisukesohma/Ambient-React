// A simple country code phone number selection drop down React Component
// by rodaan@ambient.ai
// Takes two props:
// onChange = function called when component's option is changed
// selected = value selected
import React from 'react'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'
import { map } from 'lodash'
import { countryPhoneCodes } from 'utils/countryCodeToPhone'

const propTypes = {
  selected: PropTypes.string,
  onChange: PropTypes.func,
  darkMode: PropTypes.bool,
}

const defaultProps = {
  selected: '',
  onChange: () => {},
  darkMode: false,
}

const countryOptions = map(countryPhoneCodes, ({ name, iso2, dialCode }) => ({
  value: iso2,
  label: `${name} (+${dialCode})`,
}))

export default function CountryCodeSelect({ onChange, selected }) {
  return (
    <SearchableSelectDropdown
      options={countryOptions}
      onChange={onChange}
      defaultValue={countryOptions[0]}
      value={countryOptions.find(option => option.value === selected)}
    />
  )
}

CountryCodeSelect.propTypes = propTypes
CountryCodeSelect.defaultProps = defaultProps
