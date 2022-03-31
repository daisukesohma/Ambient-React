import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon
} from '@material-ui/icons'
import { TextField, Checkbox } from '@material-ui/core'
import { some } from 'lodash'

// src
import useStyles from './style'

const propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  noOptionText: PropTypes.string,
  hasSelectAll: PropTypes.bool,
  options: PropTypes.array,
  initialValue: PropTypes.array,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  onClear: PropTypes.func,
}

const defaultProps = {
  label: '',
  placeholder: '',
  noOptionsText: '',
  initialValue: [],
  hasSelectAll: false,
  options: [],
  onSelect: () => {},
  onClose: () => {},
  onClear: () => {},
}

export default function MuiMultiSelect({
  options,
  onSelect,
  onClose,
  onClear,
  label,
  initialValue,
  placeholder,
  noOptionsText,
  hasSelectAll,
}) {
  const classes = useStyles()
  const [selectedOptions, setSelectedOptions] = useState(initialValue || [])

  const allSelected = options.length === selectedOptions.length
  const filter = createFilterOptions()

  const getOptionSelected = (option, anotherOption) => {
    return option.label === anotherOption.label
  }
  const optionRenderer = (option, { selected }) => {
    const selectAllProps =
      option.value === 'select-all' ? { checked: allSelected } : {}
    return (
      <>
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
          checkedIcon={<CheckBoxIcon fontSize='small' />}
          checked={selected}
          {...selectAllProps}
        />
        {option.label}
      </>
    )
  }
  const filterOptions = (options, params) => {
    const filtered = filter(options, params)
    return options.length > 0 && hasSelectAll
      ? [{ label: 'Select all', value: 'select-all' }, ...filtered]
      : filtered
  }
  const renderInput = params => {
    return (
      <TextField
        {...params}
        className={classes.input}
        variant='outlined'
        label={label}
        placeholder={placeholder}
      />
    )
  }
  const renderTags = (tagValue, getTagProps) => {
    return allSelected ? 'All selected' : `${tagValue.length} selected`
    // : join(map(selectedOptions, 'label'), ', ')
    // : map(tagValue, (option, index) => (
    //     <div {...getTagProps({ index })}>
    //       {option.label}
    //       {tagValue.length !== index + 1 && ', '}
    //     </div>
    //   ))
  }
  const getOptionLabel = option => option.label

  const handleSelectAll = isSelected =>
    setSelectedOptions(isSelected ? options : [])

  const handleChange = (event, selectedOptions, reason) => {
    if (reason === 'select-option' || reason === 'remove-option') {
      if (some(selectedOptions, { value: 'select-all' })) {
        handleSelectAll(!allSelected)
      } else {
        setSelectedOptions(selectedOptions)
      }
    } else if (reason === 'clear') {
      setSelectedOptions([])
      onClear([])
    }
  }

  useEffect(() => {
    onSelect(selectedOptions)
  }, [selectedOptions])

  return (
    <Autocomplete
      multiple
      limitTags={2}
      options={options}
      value={selectedOptions}
      noOptionsText={noOptionsText}
      disableCloseOnSelect
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      filterOptions={filterOptions}
      renderTags={renderTags}
      renderOption={optionRenderer}
      renderInput={renderInput}
      onChange={handleChange}
      onClose={() => onClose(selectedOptions)}
    />
  )
}

MuiMultiSelect.propTypes = propTypes
MuiMultiSelect.defaultProps = defaultProps
