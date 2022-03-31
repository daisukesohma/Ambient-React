import React from 'react'
import { CircularProgress } from 'ambient_ui'

const SerialNumberField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return <div>{node.node.hardwareSerialNumber}</div>
}

export default SerialNumberField
