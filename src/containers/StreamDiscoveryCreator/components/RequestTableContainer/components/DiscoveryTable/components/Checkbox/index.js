import React, { useState, useEffect, forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const [checked, setChecked] = useState()
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  const handleChange = event => {
    setChecked(event.target.checked)
  }

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  // original input code for posterity
  // <input type="checkbox" ref={resolvedRef} {...rest} />
  //
  return (
    <>
      <Checkbox
        size='small'
        color='primary'
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        ref={resolvedRef}
        {...rest}
      />
    </>
  )
})

export default IndeterminateCheckbox

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
}

IndeterminateCheckbox.defaultProps = {
  indeterminate: false,
}
