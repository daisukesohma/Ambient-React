import React from 'react'
import PropTypes from 'prop-types'

const KeyShortcutDisplay = ({ children, keyName }) => {
  return (
    <span style={styles.container}>
      {keyName && keyName}
      {children}
    </span>
  )
}
let styles = {
  container: {
    alignItems: 'center',
    borderRadius: 3,
    display: 'flex',
    fontSize: 12,
    justifyContent: 'center',
    lineHeight: 1.3,
    marginLeft: 4,
    padding: '1px 4px',
    pointerEvents: 'none',
  },
}
KeyShortcutDisplay.defaultProps = {
  children: null,
  keyName: '',
}

KeyShortcutDisplay.propTypes = {
  children: PropTypes.node,
  keyName: PropTypes.string,
}
export default KeyShortcutDisplay
