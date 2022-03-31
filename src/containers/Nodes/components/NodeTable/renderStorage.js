import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { CircularProgress } from 'ambient_ui'

import { calculateStorage } from '../../common/utils'

// Needs to closure around nodeStatistics data
const renderStorageWithData = nodeStatistics => rowData => {
  const { palette } = useTheme()
  const { node } = rowData
  if (nodeStatistics && nodeStatistics.length > 0) {
    const storageData = calculateStorage(
      nodeStatistics.find(({ identifier }) => identifier === node.identifier)
        .diskSpace,
    )

    // FUTURE @Eric
    // test storageData.used > 1000, if so, calculate TB, else GB
    // test storageData.total > 1000, if so, calculate TB, else GB
    //
    return (
      <div style={{ fontSize: 16, color: palette.grey[700] }}>
        {100 - storageData.percentage}
        % Used
        <br />
        <span style={{ fontSize: 12 }} className='text-muted'>
          {storageData.used} GB /{(storageData.total / 1000).toFixed(2)} TB
        </span>
      </div>
    )
  }

  // FUTURE @Eric @Rodaan
  // CircularProgress needs size (change in ambient_ui)
  return (
    <div>
      {' '}
      <CircularProgress />
    </div>
  )
}

export default renderStorageWithData
