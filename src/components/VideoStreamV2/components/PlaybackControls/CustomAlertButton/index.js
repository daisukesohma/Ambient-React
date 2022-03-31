/* eslint react/prop-types: 0 */

import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'
import { bell } from 'react-icons-kit/fa/bell'
import { plus } from 'react-icons-kit/feather/plus'

export default function CustomAlertButton({ darkMode, handleClick }) {
  const { palette } = useTheme()
  const color = darkMode ? palette.common.white : palette.grey[600]
  return (
    <div
      onClick={handleClick}
      id='alert-button-container'
      style={{ cursor: 'pointer' }}
    >
      <span style={{ color, paddingRight: 5 }}>
        <Icon icon={bell} />
      </span>
      <span
        style={{
          position: 'relative',
          right: 6,
          top: -7,
          color: palette.error.main,
        }}
      >
        <Icon icon={plus} size={12} />
      </span>
    </div>
  )
}
