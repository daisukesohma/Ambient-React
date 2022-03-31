import React from 'react'

const TrackingField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return (
    <div>
      <a
        href={`https://www.google.com/search?q=${node.tracking}`}
        target='_'
        style={{ color: 'white' }}
      >
        {node.tracking}
      </a>
    </div>
  )
}

export default TrackingField
