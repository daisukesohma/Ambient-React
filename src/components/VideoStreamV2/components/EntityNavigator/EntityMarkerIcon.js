import React from 'react'

import EntityMarker from '../PlaybackControls/TimelineContainer/MarkersContainer/EntityMarkerContainer/EntityMarker'

const HEIGHT = 20

export default function EntityMarkerIcon() {
  return (
    <span>
      <svg viewBox='-5 -5 10 14' height={HEIGHT} width={HEIGHT}>
        <EntityMarker ts={0} x={-6} width={10} y={0} />
      </svg>
    </span>
  )
}
