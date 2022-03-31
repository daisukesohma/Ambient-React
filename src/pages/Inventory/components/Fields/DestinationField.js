import React from 'react'
import { CircularProgress } from 'ambient_ui'

const DestinationField = ({ rowData, darkMode }) => {
  const { node } = rowData

  return (
    <div>
      <a href={node.shippingTrackingLink} target='_' style={{ color: 'white' }}>
        {node.shippingInfo ||
          (node.shippingTrackingLink &&
            node.shippingTrackingLink.substr(0, 10))}
      </a>
    </div>
  )
}

export default DestinationField
