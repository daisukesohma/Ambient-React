import React from 'react'
import get from 'lodash/get'

const NameField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return (
    <>
      <div>{get(node, 'node.name')}</div>
    </>
  )
}

export default NameField
