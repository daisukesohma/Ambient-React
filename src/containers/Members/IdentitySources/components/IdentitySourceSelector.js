import React from 'react'
import PropTypes from 'prop-types'
import { SearchableSelectDropdown } from 'ambient_ui'
import FormHelperText from '@material-ui/core/FormHelperText'

const IdentitySourceSelector = ({
  options,
  initialValue,
  onChange,
  helperText,
  ...props
}) => {
  return (
    <div>
      <SearchableSelectDropdown
        defaultValue={initialValue}
        options={options}
        onChange={onChange}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  )
}

IdentitySourceSelector.propTypes = {
  helperText: PropTypes.any,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
}

IdentitySourceSelector.defaultProps = {
  initialValue: '',
  onChange: () => {},
  options: [],
}

export default IdentitySourceSelector
