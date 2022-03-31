import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import CheckIcon from '@material-ui/icons/Check'
import NewReleasesIcon from '@material-ui/icons/NewReleases'

function NodeUpgradeSummary({ upgradeableCount, total }) {
  const { palette } = useTheme()
  const style = {
    padding: '2px 6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    color: 'white',
    fontSize: 12,
  }

  if (upgradeableCount >= 0 && total >= 0) {
    if (upgradeableCount === 0) {
      return (
        <div
          style={{
            ...style,
            border: `1px solid ${palette.primary.main}`,
            backgroundColor: palette.primary.main,
          }}
        >
          <CheckIcon />
          All Appliances are up-to-date
        </div>
      )
    }

    return (
      <div
        style={{
          ...style,
          border: `1px solid ${palette.warning.main}`,
          backgroundColor: palette.warning.main,
        }}
      >
        <span style={{ marginRight: 4 }}>
          <NewReleasesIcon />
        </span>
        {upgradeableCount} /{total} can be upgraded
      </div>
    )
  }
  return null
}

NodeUpgradeSummary.defaultProps = {
  upgradeableCount: 0,
  total: 0,
}

NodeUpgradeSummary.propTypes = {
  upgradeableCount: PropTypes.number,
  total: PropTypes.number,
}

export default NodeUpgradeSummary
