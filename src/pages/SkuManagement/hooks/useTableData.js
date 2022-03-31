import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import get from 'lodash/get'
// src
import TableCell from 'components/Table/Cell'

import { ActionsField, HardwarePartnerField } from '../components/Fields'

const useTableData = () => {
  const [limit, setLimit] = useState(25)
  const darkMode = useSelector(state => state.settings.darkMode)

  const columns = [
    {
      title: 'Hardware Partner',
      render: row => <HardwarePartnerField rowData={row} darkMode={darkMode} />,
    },
    {
      title: 'SKU',
      render: ({ node }) => <TableCell>{node.identifier}</TableCell>,
    },
    {
      title: 'Price',
      render: ({ node }) => <TableCell>${node.price}</TableCell>,
      sorting: true,
      field: 'price',
      sortBy: 'price',
    },
    {
      title: 'GPU',
      render: ({ node }) => <TableCell>{get(node, 'gpu.name')}</TableCell>,
    },
    {
      title: 'Memory',
      render: ({ node }) => {
        const value = node.memory < 1000 ? node.memory : node.memory / 1000
        const label = node.memory < 1000 ? 'GB' : 'TB'

        return (
          <TableCell>
            {value}
            {label}
          </TableCell>
        )
      },
    },
    {
      title: 'SSD',
      render: ({ node }) => {
        const value =
          node.ssdStorage < 1000 ? node.ssdStorage : node.ssdStorage / 1000
        const label = node.ssdStorage < 1000 ? 'GB' : 'TB'

        return (
          <TableCell>
            {value}
            {label}
          </TableCell>
        )
      },
    },
    {
      title: 'HDD',
      render: ({ node }) => {
        const value =
          node.hddStorage < 1000 ? node.hddStorage : node.hddStorage / 1000
        const label = node.hddStorage < 1000 ? 'GB' : 'TB'

        return (
          <TableCell>
            {value}
            {label}
          </TableCell>
        )
      },
    },
    {
      title: 'Actions',
      render: row => (
        <ActionsField rowData={row} handleRestartClick={() => {}} />
      ),
    },
  ]

  return {
    columns,
    limit,
    setLimit,
  }
}

export default useTableData
