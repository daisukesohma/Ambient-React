import { createSelector } from '@reduxjs/toolkit'
import matchSorter from 'match-sorter'

export default createSelector(
  [
    state => state.forensics.streamNodes,
    state => state.forensics.regionStats,
    state => state.forensics.activeRegions,
    state => state.forensics.viableRegionsCount,
    state => state.forensics.streamQuery,
  ],
  (
    streamNodes,
    regionStats,
    activeRegions,
    viableRegionsCount,
    streamQuery,
  ) => {
    // Error Handling
    if (
      !activeRegions ||
      activeRegions.length >= viableRegionsCount ||
      !regionStats ||
      !streamNodes ||
      !streamNodes.length
    ) {
      return []
    }

    const active = streamNodes.filter(
      streamNode => activeRegions.indexOf(streamNode.regionId) > -1,
    )

    if (streamQuery) {
      return matchSorter(active, streamQuery, { keys: ['name'] })
    }

    return active
  },
)
