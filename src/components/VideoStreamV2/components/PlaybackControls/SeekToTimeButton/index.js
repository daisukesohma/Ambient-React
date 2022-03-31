import React from 'react'
import PropTypes from 'prop-types'
import { clock } from 'react-icons-kit/feather/clock'
import { useTheme } from '@material-ui/core/styles'
import { Icon } from 'react-icons-kit'

const SeekToTimeButton = ({ darkMode }) => {
  const { palette } = useTheme()
  const color = darkMode ? palette.common.white : palette.common.black
  return (
    <div style={{ color, cursor: 'pointer' }}>
      <Icon icon={clock} />
    </div>
  )
}

SeekToTimeButton.defaultProps = {
  darkMode: false,
}
SeekToTimeButton.propTypes = {
  darkMode: PropTypes.bool,
}
export default SeekToTimeButton
