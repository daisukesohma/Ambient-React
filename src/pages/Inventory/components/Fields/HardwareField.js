import React from 'react'
import get from 'lodash/get'

const HardwareField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return (
    <div>
      {`${get(node, 'node.hardwareSku.hardwarePartner.name')} ${get(
        node,
        'node.hardwareSku.identifier',
      )}`}
    </div>
  )
}

export default HardwareField
