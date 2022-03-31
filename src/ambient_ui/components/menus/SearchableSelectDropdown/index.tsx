/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import Async from 'react-select/async'
import SelectCreatable from 'react-select/creatable'
import get from 'lodash/get'
import toString from 'lodash/toString'
import isString from 'lodash/isString'
import { Option } from 'react-select/src/filters'
import { SettingsSliceProps } from 'redux/slices/settings'

import customStyles from './styles'
import { SiteSelectDropdownProps } from './types'

const SearchableSelectDropdown: React.FC<SiteSelectDropdownProps> = ({
  classOverride,
  creatable,
  getAsyncOptions,
  isAsync,
  isMulti = false,
  isSearchable = true,
  menuPlacement,
  menuPortalTarget,
  onChange,
  options,
  placeholder,
  styles,
  value,
  customBackgroundColor,
  ...props
}): JSX.Element => {
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const filterOption = (candidate: Option, input: string) => {
    const lowered = input.toLowerCase()
    const filteredByValue = toString(get(candidate, 'value', ''))
      .toLowerCase()
      .includes(lowered)
    const filteredByFilterLabel = get(candidate, 'data.filterLabel', '')
      .toLowerCase()
      .includes(lowered)
    const label = get(candidate, 'label', '')

    if (isString(label)) {
      return (
        filteredByValue ||
        filteredByFilterLabel ||
        label.toLowerCase().includes(lowered)
      )
    }
    return filteredByValue || filteredByFilterLabel
  }

  if (isAsync) {
    return (
      <Async
        {...props}
        loadOptions={getAsyncOptions}
        cacheOptions
        styles={{
          ...customStyles({ darkMode, customBackgroundColor }),
          ...styles,
        }}
        isMulti={isMulti}
        defaultOptions
        onChange={onChange}
        filterOption={filterOption}
        placeholder={placeholder}
        menuPortalTarget={menuPortalTarget}
        menuPlacement={menuPlacement}
      />
    )
  }

  return creatable ? (
    <SelectCreatable
      {...props}
      options={options}
      styles={{
        ...customStyles({ darkMode, customBackgroundColor }),
        ...styles,
      }}
      isMulti={isMulti}
      onChange={onChange}
      filterOption={filterOption}
      menuPortalTarget={menuPortalTarget}
      menuPlacement={menuPlacement}
    />
  ) : (
    <Select
      options={options}
      styles={{
        ...customStyles({ darkMode, customBackgroundColor }),
        ...styles,
      }}
      isMulti={isMulti}
      isSearchable={isSearchable}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      className={classOverride}
      filterOption={filterOption}
      menuPortalTarget={menuPortalTarget}
      menuPlacement={menuPlacement}
      {...props}
    />
  )
}

SearchableSelectDropdown.defaultProps = {
  isMulti: false,
  isAsync: false,
  getAsyncOptions: undefined,
  creatable: false,
  isSearchable: true,
  classOverride: '',
  menuPortalTarget: null,
  menuPlacement: 'auto',
  styles: undefined,
  customBackgroundColor: undefined,
}

export default SearchableSelectDropdown
