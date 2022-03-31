import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

const SimpleOption = ({ leftIcon, title, subtitle }) => {
  const { palette } = useTheme()
  return (
    <>
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          paddingLeft: 2,
        }}
      >
        {leftIcon && (
          <span
            style={{
              marginRight: 10,
              width: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {leftIcon}
          </span>
        )}
        <span style={{ color: palette.common.black }}>{title}</span>
      </div>
      {subtitle && (
        <div
          style={{
            color: palette.grey[500],
            fontSize: 10,
            paddingLeft: 20,
            marginTop: -4,
          }}
        >
          {subtitle}
        </div>
      )}
    </>
  )
}

SimpleOption.defaultProps = {
  leftIcon: null,
  title: '',
  subtitle: '',
}

SimpleOption.propTypes = {
  leftIcon: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
}

export default SimpleOption
