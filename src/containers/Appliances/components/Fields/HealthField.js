import React from 'react'
import { CircularProgress } from 'ambient_ui'
import get from 'lodash/get'
import find from 'lodash/find'

import { calculateStorage } from '../../common/utils'
import NodeServiceStatus from '../NodeServiceStatus'

const DEFAULT_EMPTY_VALUE = 'Not connected'

// Needs closure around nodeStatistics data if abstracting to new file
const HealthField = ({ nodeStatistics, rowData, darkMode }) => {
  const { node } = rowData
  if (get(nodeStatistics, 'length')) {
    const nodeDetails = find(
      nodeStatistics,
      ({ identifier }) => identifier === node.identifier,
    )
    if (!nodeDetails) {
      return DEFAULT_EMPTY_VALUE
    }
    const storageData = calculateStorage(nodeDetails.diskSpace)

    return (
      <NodeServiceStatus
        nodeDetail={nodeDetails}
        darkMode={darkMode}
        isConnected={storageData.isConnected}
      />
    )
  }

  return (
    <div>
      {' '}
      <CircularProgress />
    </div>
  )
}

export default HealthField
