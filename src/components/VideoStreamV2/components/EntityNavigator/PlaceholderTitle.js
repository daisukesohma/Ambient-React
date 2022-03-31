import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import EntityMarkerIcon from './EntityMarkerIcon'

const PlaceholderTitle = ({ darkMode, text }) => {
  const { palette } = useTheme()
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      color: darkMode ? palette.common.white : palette.grey[900],
      cursor: 'pointer',
    },
    iconContainer: { marginRight: 4 },
  }

  return (
    <div style={styles.container}>
      <span style={styles.iconContainer}>
        <EntityMarkerIcon />
      </span>
      <span>{text}</span>
    </div>
  )
}

PlaceholderTitle.defaultProps = {
  darkMode: false,
  text: '',
}

PlaceholderTitle.propTypes = {
  darkMode: PropTypes.bool,
  text: PropTypes.string,
}

export default PlaceholderTitle
