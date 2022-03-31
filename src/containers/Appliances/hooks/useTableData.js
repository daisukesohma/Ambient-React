import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import get from 'lodash/get'
// src
import TableCell from 'components/Table/Cell'
// import formatMetadata from 'selectors/appliances/formatMetadata'

import {
  ActionsField,
  HealthField,
  StorageField,
  // VersionField, // Not being used anymore 3/5/2021
} from '../components/Fields'

const useTableData = ({ handleRestartClick }) => {
  const [limit, setLimit] = useState(25)
  const darkMode = useSelector(state => state.settings.darkMode)
  // const metadata = useSelector(formatMetadata) // Node Package Metadata
  const nodeStatistics = useSelector(state =>
    get(state, 'appliances.nodeStatistics'),
  )

  const columns = [
    {
      title: 'Appliance',
      field: 'name',
      render: row => <TableCell>{get(row, 'name')}</TableCell>,
      sorting: true,
    },
    {
      title: 'Storage',
      render: row => (
        <StorageField
          rowData={row}
          nodeStatistics={nodeStatistics}
          darkMode={darkMode}
        />
      ),
      sorting: false,
    },
    {
      title: 'Health',
      render: row => (
        <HealthField
          rowData={row}
          nodeStatistics={nodeStatistics}
          darkMode={darkMode}
        />
      ),
      sorting: false,
    },
    {
      title: 'Actions',
      render: row => (
        <ActionsField rowData={row} handleRestartClick={handleRestartClick} />
      ),
      sorting: false,
    },
  ]

  return {
    columns,
    limit,
    setLimit,
  }
}

export default useTableData
