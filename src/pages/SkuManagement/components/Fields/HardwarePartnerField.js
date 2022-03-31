import React from 'react'

const HardwarePartner = ({ rowData, darkMode }) => {
  const { node } = rowData

  return (
    <>
      <div>{node.hardwarePartner.name}</div>
    </>
  )
}

export default HardwarePartner
