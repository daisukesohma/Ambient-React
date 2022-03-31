import React from 'react'
import { CircularProgress } from 'ambient_ui'

const DestinationField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return <div>{node.destination}</div>
}

export default DestinationField
