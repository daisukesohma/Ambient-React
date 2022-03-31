import React, { useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import CheckIcon from '@material-ui/icons/Check'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import { useSelector } from 'react-redux'
import get from 'lodash/get'
import clsx from 'clsx'
// src
import allNodesByAccount from 'selectors/appliances/allNodesByAccount'
import formatMetadata from 'selectors/appliances/formatMetadata'
import { useFlexStyles } from 'common/styles/commonStyles'

import {
  isNodeVersionConfigMonitorEnabled,
  isNodeVersionUpgradeable,
} from '../../common/utils'

import useStyles from './styles'

function NodeUpgradeSummary() {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const metadata = useSelector(formatMetadata) // Node Package Metadata
  const [upgradeableCount, setUpgradeableCount] = useState(0) // quick summary value
  const classes = useStyles()
  const nodes = useSelector(allNodesByAccount)
  const total = nodes.length

  // Calculate summary of Nodes that are upgradeable
  useEffect(() => {
    if (nodes && get(metadata, 'version')) {
      const count = nodes.filter(n => {
        if (n.buildVersion) {
          return (
            isNodeVersionConfigMonitorEnabled(n.buildVersion) &&
            isNodeVersionUpgradeable(n.buildVersion, metadata.version)
          )
        } // filter based on result of if its upgradeable
        return false // if no build version or configmonitor is not enabled, don't count
      }).length

      setUpgradeableCount(count)
    }
  }, [nodes, metadata])

  if (upgradeableCount >= 0 && total >= 0) {
    if (upgradeableCount === 0) {
      return (
        <div
          className={clsx(
            classes.root,
            'am-caption',
            flexClasses.row,
            flexClasses.centerAll,
          )}
          style={{
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
        className={classes.root}
        style={{
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
