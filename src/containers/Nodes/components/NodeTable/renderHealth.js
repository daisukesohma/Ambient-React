import React from 'react'
import { CircularProgress } from 'ambient_ui'

import NodeServiceStatus from '../NodeServiceStatus'

// Needs closure around nodeStatistics data if abstracting to new file
const renderHealthWithData = nodeStatistics => rowData => {
  const { node } = rowData
  if (nodeStatistics && nodeStatistics.length > 0) {
    const nodeDetails = nodeStatistics.find(({ identifier }) => identifier === node.identifier)

    return <NodeServiceStatus nodeDetail={nodeDetails} />
  }
  return (
    <div>
      {' '}
      <CircularProgress />
    </div>
  )
}

export default renderHealthWithData
