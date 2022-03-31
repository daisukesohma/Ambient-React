import { createSelector } from '@reduxjs/toolkit'
import some from 'lodash/some'

export default createSelector(
  [
    // ALERTS
    state => state.contextGraph.loading,
    state => state.contextGraph.editLoading,
    state => state.contextGraph.deleteLoading,
    // SITES
    state => state.contextGraph.loadingSites,
    // STREAMS
    state => state.contextGraph.loadingStreams,
    // REGIONS
    state => state.contextGraph.loadingRegions,
    // SP
    state => state.contextGraph.loading,
    state => state.contextGraph.creationLoading,
    state => state.contextGraph.updateLoading,
    state => state.contextGraph.deleteLoading,
  ],
  (a1, a2, a3, a4, a5, a6, a7, a8) => some([a1, a2, a3, a4, a5, a6, a7, a8]),
)
