import React from 'react'

const SkuField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return <div>{node.sku}</div>
}

export default SkuField
