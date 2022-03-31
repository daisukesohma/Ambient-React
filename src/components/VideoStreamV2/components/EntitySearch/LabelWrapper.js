import React from 'react'
import PropTypes from 'prop-types'

const LabelWrapper = ({ children, darkMode }) => {
  return (
    <div
      style={{
        cursor: 'pointer',
        color: darkMode ? 'white' : '#1881FF',
      }}
    >
      {children}
    </div>
  )
}

LabelWrapper.defaultProps = {
  children: null,
  darkMode: false,
}
LabelWrapper.propTypes = {
  children: PropTypes.node,
  darkMode: PropTypes.bool,
}
export default LabelWrapper
