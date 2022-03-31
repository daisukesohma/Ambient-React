/*
 * Assumes snapshots are stored at snapshotRoot (see below)
 */
import React from 'react'
import PropTypes from 'prop-types'
// src
import Tooltip from 'components/Tooltip'

const snapshotRoot = 'https://dev.ambient.ai/static/analytics/snapshots'

const propTypes = {
  name: PropTypes.string,
  srcKey: PropTypes.string,
}

function NameWithSnapshot({ name, srcKey }) {
  return (
    <Tooltip
      placement='top'
      content={
        <img
          alt=''
          style={{ width: 200, height: 200 }}
          src={`${snapshotRoot}/${srcKey}.png`}
        />
      }
    >
      {name}
    </Tooltip>
  )
}

NameWithSnapshot.propTypes = propTypes

export default NameWithSnapshot
