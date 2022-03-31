import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'

const NoOptionsMessageCustom = ({ darkMode, onClick, ...props }) => {
  // const style = {
  //   ...styles.text,
  //   color: darkMode ? 'white' : 'blue',
  // }

  // not used, keeping in case
  // const ClearButton = (handleClick) => {
  //   return (
  //     <div onClick={onClick} style={style}>
  //       Clear
  //     </div>
  //   )
  // }

  return (
    <components.NoOptionsMessage {...props}>
      <div />
    </components.NoOptionsMessage>
  )
}

// let styles = {
//   text: {
//     cursor: 'pointer',
//     fontSize: 14,
//   },
// }

NoOptionsMessageCustom.defaultProps = {
  darkMode: false,
  onClick: () => {},
}
NoOptionsMessageCustom.propTypes = {
  darkMode: PropTypes.bool,
  onClick: PropTypes.func,
}
export default NoOptionsMessageCustom
