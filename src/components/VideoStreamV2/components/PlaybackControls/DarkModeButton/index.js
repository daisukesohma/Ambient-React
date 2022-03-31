/* eslint react/prop-types: 0 */

import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'
import { moon } from 'react-icons-kit/feather/moon'

export default function DarkModeButton({ darkMode, toggleDarkMode }) {
  const { palette } = useTheme()
  return (
    <div
      id='darkModeButton'
      style={{ cursor: 'pointer' }}
      onClick={toggleDarkMode}
    >
      <span
        style={{ color: darkMode ? palette.common.white : palette.grey[600] }}
      >
        <Icon icon={moon} />
      </span>
    </div>
  )
}
