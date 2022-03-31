import { css } from 'goober'
import React from 'react'

import { ISelectProps } from '../lib/interfaces'
import SelectPanel from '../select-panel'

import Dropdown from './dropdown'
import DropdownHeader from './header'

const MultiSelectBox = css({
  '--rmscMain': '#4285f4',
  '--rmscHover': '#f1f3f5',
  '--rmscSelected': '#e2e6ea',
  '--rmscBorder': '#ccc',
  '--rmscGray': '#aaa',
  '--rmscBg': '#fff',
  '--rmscP': '10px',
  '--rmscRadius': '4px',
  '--rmscH': '38px',

  '*': {
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  '.gray': {
    color: 'var(--rmsc-gray)',
  },
})

const MultiSelectBoxDarkMode = css({
  '--rmscMain': '#FFFFFF',
  '--rmscHover': '#626469',
  '--rmscSelected': '#0056CB',
  '--rmscBorder': '#43454A',
  '--rmscGray': '#9FA2A7',
  '--rmscBg': '#43454A',
  '--rmscP': '10px',
  '--rmscRadius': '4px',
  '--rmscH': '38px',

  '*': {
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  'input[type=text]': {
    backgroundColor: 'var(--rmscBg)',
    color: 'var(--rmscMain)',
  },
  '.gray': {
    color: 'var(--rmsc-gray)',
  },
  '::placeholder': {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: '#BEC0C6',
    opacity: 1 /* Firefox */,
  },

  ':-ms-input-placeholder': {
    /* Internet Explorer 10-11 */
    color: '#BEC0C6',
  },

  '::-ms-input-placeholder': {
    /* Microsoft Edge */
    color: '#BEC0C6',
  },
})

function MultiSelect({
  focusSearchOnOpen = true,
  hasSelectAll = true,
  shouldToggleOnHover,
  className = 'multi-select',
  options,
  value,
  valueRenderer,
  overrideStrings,
  onChange,
  disabled,
  ItemRenderer,
  ArrowRenderer,
  selectAllLabel,
  isLoading,
  disableSearch,
  filterOptions,
  labelledBy,
  onMenuToggle,
  ClearIcon,
  debounceDuration = 300,
  ClearSelectedIcon,
  darkMode,
}: ISelectProps): JSX.Element {
  const nvalue = value || []
  return (
    <div
      className={
        darkMode
          ? `${MultiSelectBoxDarkMode} ${className}`
          : `${MultiSelectBox} ${className}`
      }
    >
      <Dropdown
        isLoading={isLoading}
        contentComponent={SelectPanel}
        shouldToggleOnHover={shouldToggleOnHover}
        contentProps={{
          ItemRenderer,
          options,
          value: nvalue,
          hasSelectAll,
          selectAllLabel,
          onChange,
          disabled,
          disableSearch,
          focusSearchOnOpen,
          filterOptions,
          overrideStrings,
          ClearIcon,
          debounceDuration,
        }}
        disabled={disabled}
        labelledBy={labelledBy}
        onMenuToggle={onMenuToggle}
        ArrowRenderer={ArrowRenderer}
        ClearSelectedIcon={ClearSelectedIcon}
      >
        <DropdownHeader
          value={nvalue}
          options={options}
          valueRenderer={valueRenderer}
          overrideStrings={overrideStrings}
        />
      </Dropdown>
    </div>
  )
}

export default MultiSelect
