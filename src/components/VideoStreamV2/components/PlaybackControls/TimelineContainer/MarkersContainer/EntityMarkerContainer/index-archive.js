/* eslint-disable camelcase */
import React from 'react'
import PropTypes from 'prop-types'

import { getZoomTS, tsAtMidnight } from '../../../../../utils'
import { SEC_IN_DAY } from '../../../../../utils/constants'

import EntityMarker from './EntityMarker'

// Used to see how many documents we need before being sure to say a entity was detected
const MIN_ENTITY_DOC_COUNT = 1

const EntityMarkerContainer = ({
  checkIfUnixTsHasData,
  entityMetadata,
  selectedEntities,
  setDisplayedEntityMarkers,
  subtractDays,
  zoomLevel,
}) => {
  // Renders the entity markers
  const entityMarkers = []
  const displayedEntityMarkerData = []
  if (selectedEntities && selectedEntities.length > 0) {
    const entityLabel = selectedEntities.map(e => e.label).join(' ') // for displayedEntityMarkerData
    let timeUnit
    let timeUnitTs
    let timeUnitX = 0
    let max

    // TODO: Need to handle when different metadata entities are displayed --> Intersection Search
    for (let k = 0; k < entityMetadata.length; ++k) {
      const { buckets } = entityMetadata[k].aggregations.by_time_unit
      for (let i = 0; i < buckets.length; ++i) {
        timeUnit = buckets[i]
        timeUnitTs = timeUnit.key / 1000
        const timeUnitSecondsAfterMidnight =
          timeUnitTs - tsAtMidnight(subtractDays)
        timeUnitX = getZoomTS(timeUnitSecondsAfterMidnight, zoomLevel)

        // This is to set the largest most point of the timeline to be MIN_IN_DAY (number of minutes in a day) vs SEC_IN_DAY (number of seconds in a day)
        // Divides current X by 60 if not zoomed in since currX is in seconds and want to view currX in minutes
        // Will only show markers on current day or archival --> sanity check to make sure it doesn't show anything after current

        max = getZoomTS(SEC_IN_DAY, zoomLevel)

        if (
          checkIfUnixTsHasData(timeUnitTs) && // @PRODUCTION: UNCOMMENT THIS //  @TESTING: COMMENT OUT TO SEE  MOCK DATA
          timeUnit.doc_count >= MIN_ENTITY_DOC_COUNT &&
          timeUnitX <= max &&
          !Number.isNaN(timeUnit)
        ) {
          displayedEntityMarkerData.push({
            label: entityLabel,
            ts: timeUnitTs,
            x: timeUnitX,
          })

          // eslint-disable-line
          entityMarkers.push(<EntityMarker ts={timeUnitTs} x={timeUnitX} />)
        }
      }
    }
    setDisplayedEntityMarkers(displayedEntityMarkerData) // pass up to parent
  }

  return <g id='timeline-datapoints-entity-markers'>{entityMarkers}</g>
}

EntityMarkerContainer.defaultProps = {
  checkIfUnixTsHasData: () => {},
  entityMetadata: [],
  selectedEntities: [],
  setDisplayedEntityMarkers: () => {},
  subtractDays: 0,
  zoomLevel: 5,
}

EntityMarkerContainer.propTypes = {
  checkIfUnixTsHasData: PropTypes.func,
  entityMetadata: PropTypes.array,
  selectedEntities: PropTypes.array,
  setDisplayedEntityMarkers: PropTypes.func,
  subtractDays: PropTypes.number,
  zoomLevel: PropTypes.number,
}
export default EntityMarkerContainer
