import React from 'react'
import { CircularProgress } from 'ambient_ui'

const VendorField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return <div style={{ width: 300 }}>{node.vendor}</div>
}

export default VendorField
