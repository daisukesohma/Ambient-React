import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { CircularProgress } from 'ambient_ui'
import get from 'lodash/get'
import find from 'lodash/find'

import { calculateStorage } from '../../common/utils'

const DEFAULT_EMPTY_VALUE = '-'

// Needs to closure around nodeStatistics data
const StorageField = ({ nodeStatistics, rowData, darkMode }) => {
  const { palette } = useTheme()
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

    // FUTURE @Eric
    // test storageData.used > 1000, if so, calculate TB, else GB
    // test storageData.total > 1000, if so, calculate TB, else GB
    //
    if (!storageData.isConnected) return '-'

    return (
      <div>
        <div
          className='am-subtitle2'
          style={{ color: darkMode ? palette.grey[100] : palette.grey[700] }}
        >
          {`${100 - storageData.percentage}% Used`}
          <br />
          <span className='am-caption'>
            {storageData.used} GB /{(storageData.total / 1000).toFixed(2)} TB
          </span>
        </div>
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

export default StorageField
