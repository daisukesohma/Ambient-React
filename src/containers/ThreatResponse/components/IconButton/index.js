import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'ambient_ui'
import './index.css'

const IconButton = ({ disabled, icon, labelInfo, onClick, customStyle }) => {
  const Icon = icon

  return (
    <Button
      variant={'default'}
      onClick={onClick}
      disabled={disabled ? 'disabled' : null}
      customStyle={customStyle}
    >
      {icon && (
        <Icon style={{ fontSize: 25, marginRight: labelInfo ? 5 : 0 }} />
      )}
      <span style={{ marginLeft: 4 }}>{labelInfo}</span>
    </Button>
  )
}

IconButton.defaultProps = {
  disabled: false,
  icon: null,
  labelInfo: '',
  onClick: () => {},
  customStyle: {},
}

IconButton.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.bool,
  labelInfo: PropTypes.string,
  onClick: PropTypes.func,
  customStyle: PropTypes.object,
}

export default IconButton
