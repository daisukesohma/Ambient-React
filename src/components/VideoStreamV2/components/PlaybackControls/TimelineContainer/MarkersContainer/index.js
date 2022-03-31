/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import EntityMarkerContainer from './EntityMarkerContainer'
import MotionMarkerContainer from './MotionMarkerContainer'
import NonMotionMarkerContainer from './NonMotionMarkerContainer'

const MarkersContainer = ({
  catalog,
  entityMetadata,
  isHoveringOnTimeline,
  retention,
  selectedEntities,
  setDisplayedEntityMarkers,
  subtractDays,
  checkIfUnixTsHasData,
  viewWindowPosition,
  withinNonMotionRetentionDuration,
  zoomLevel,
}) => {
  return (
    <g id="timeline-datapoints">
      <NonMotionMarkerContainer
        isHoveringOnTimeline={isHoveringOnTimeline}
        retention={retention}
        subtractDays={subtractDays}
        withinNonMotionRetentionDuration={withinNonMotionRetentionDuration}
        zoomLevel={zoomLevel}
      />
      <MotionMarkerContainer
        catalog={catalog}
        subtractDays={subtractDays}
        viewWindowPosition={viewWindowPosition}
        zoomLevel={zoomLevel}
      />
      <EntityMarkerContainer
        entityMetadata={entityMetadata}
        selectedEntities={selectedEntities}
        setDisplayedEntityMarkers={setDisplayedEntityMarkers}
        subtractDays={subtractDays}
        checkIfUnixTsHasData={checkIfUnixTsHasData}
        zoomLevel={zoomLevel}
      />
    </g>
  )
}

MarkersContainer.defaultProps = {
  catalog: [],
  checkIfUnixTsHasData: () => {},
  entityMetadata: [],
  isHoveringOnTimeline: false,
  retention: {},
  selectedEntities: [],
  setDisplayedEntityMarkers: () => {},
  subtractDays: 0,
  viewWindowPosition: 0,
  withinNonMotionRetentionDuration: () => {},
  zoomLevel: 5,
}

MarkersContainer.propTypes = {
  catalog: PropTypes.array,
  checkIfUnixTsHasData: PropTypes.func,
  entityMetadata: PropTypes.array,
  isHoveringOnTimeline: PropTypes.bool,
  retention: PropTypes.object,
  selectedEntities: PropTypes.array,
  setDisplayedEntityMarkers: PropTypes.func,
  subtractDays: PropTypes.number,
  viewWindowPosition: PropTypes.number,
  withinNonMotionRetentionDuration: PropTypes.func,
  zoomLevel: PropTypes.number,
}
export default MarkersContainer
