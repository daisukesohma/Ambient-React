/* eslint-disable camelcase */
import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { getZoomTS, tsAtMidnight } from '../../../../../utils'

import EntityMarker from './EntityMarker'

const getConcatenatedSelectedEntityName = selectedEntities => {
  const selectedLabels = selectedEntities.map(e => e.label)
  return selectedLabels.join(' ')
}

const EntityMarkerContainer = ({
  checkIfUnixTsHasData,
  entityMetadata,
  selectedEntities,
  setDisplayedEntityMarkers,
  subtractDays,
  zoomLevel,
}) => {
  const [entityMarkers, setEntityMarkers] = useState(null)

  const createEntityMarkers = rangeData => {
    return rangeData.map(r => {
      return (
        <EntityMarker
          ts={r.startTs}
          x={r.startX}
          width={r.widthX}
          key={r.startX}
        />
      )
    })
  }

  const augmentTimeRangeData = ranges => {
    const entityLabel = getConcatenatedSelectedEntityName(selectedEntities)
    const augmentedRanges = ranges.map(r => {
      const startSecOfDay = r.startTs - tsAtMidnight(subtractDays)
      const endSecOfDay = r.endTs - tsAtMidnight(subtractDays)
      const startX = getZoomTS(startSecOfDay, zoomLevel)
      const endX = getZoomTS(endSecOfDay, zoomLevel)

      return {
        startTs: r.startTs,
        endTs: r.endTs,
        startX,
        endX,
        widthX: endX - startX,
        widthTs: r.endTs - r.startTs,
        label: entityLabel,
      }
    })
    return augmentedRanges
  }

  const getTimeRangesFromTimeUnits = () => {
    const timeUnitRanges = [] // { startTs, endTs, startX, endX, width, label: entityLabel }
    let latestTimeUnitRange = {}

    for (let k = 0; k < entityMetadata.length; ++k) {
      const { buckets } = entityMetadata[k].aggregations.by_time_unit
      for (let i = 0; i < buckets.length; i++) {
        const timeUnit = buckets[i]
        if (
          timeUnit.doc_count > 0 && // has documents
          !latestTimeUnitRange.startTs // is a new range
        ) {
          latestTimeUnitRange.startTs = timeUnit.key / 1000
        } else if (
          timeUnit.doc_count === 0 && // has no documents
          latestTimeUnitRange.startTs // range was started
        ) {
          latestTimeUnitRange.endTs = timeUnit.key / 1000
          timeUnitRanges.push(latestTimeUnitRange) // add it to the list
          latestTimeUnitRange = {} // then reset the range
        }
      }
    }
    return timeUnitRanges
  }

  useMemo(() => {
    if (selectedEntities && selectedEntities.length > 0) {
      const timeUnitRanges = getTimeRangesFromTimeUnits()
      const data = augmentTimeRangeData(timeUnitRanges)
      setDisplayedEntityMarkers(data) // pass up to parent (why?)

      const markers = createEntityMarkers(data)
      setEntityMarkers(markers)
    }
    // eslint-disable-next-line
  }, [selectedEntities, zoomLevel])

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
