import React from 'react'

const TrackingField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return (
    <div>
      <a href={node.shippingTrackingLink} target='_' style={{ color: 'white' }}>
        {node.shippingTrackingLink}
      </a>
    </div>
  )
}

export default TrackingField
