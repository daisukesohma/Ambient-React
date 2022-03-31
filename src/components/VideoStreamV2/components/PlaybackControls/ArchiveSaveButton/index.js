import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { download } from 'react-icons-kit/feather/download'
import { Icon } from 'react-icons-kit'

const ArchiveSaveButton = ({ toggleExportMode }) => {
  const { palette } = useTheme()
  const styles = {
    container: {
      padding: 8,
      cursor: 'pointer',
    },
    icon: {
      color: palette.primary.main,
      paddingRight: 5,
    },
    save: {
      color: palette.primary.main,
    },
  }

  return (
    <div
      id='archive-save-button'
      onClick={toggleExportMode}
      style={styles.container}
    >
      <span style={styles.icon}>
        <Icon icon={download} />
      </span>
      <span style={styles.save}>Save</span>
    </div>
  )
}

ArchiveSaveButton.defaultProps = {
  toggleExportMode: () => {},
}

ArchiveSaveButton.propTypes = {
  toggleExportMode: PropTypes.func,
}

export default ArchiveSaveButton
