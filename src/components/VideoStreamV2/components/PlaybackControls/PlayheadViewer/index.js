/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-icons-kit'
import { ic_gps_not_fixed } from 'react-icons-kit/md/ic_gps_not_fixed'
import { useTheme } from '@material-ui/core/styles'

const SIZE = 18

function PlayheadViewer({ isPlayheadInRange, setShouldResetPlayheadInRange }) {
  const { palette } = useTheme()
  return (
    <div>
      {!isPlayheadInRange && (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setShouldResetPlayheadInRange(true)}
        >
          <div style={{ color: palette.error.main }}>
            <Icon icon={ic_gps_not_fixed} size={SIZE} />
          </div>
        </div>
      )}
    </div>
  )
}

PlayheadViewer.defaultProps = {
  isPlayheadInRange: true,
  setShouldResetPlayheadInRange: () => {},
}

PlayheadViewer.propTypes = {
  isPlayheadInRange: PropTypes.bool,
  setShouldResetPlayheadInRange: PropTypes.func,
}

export default PlayheadViewer
