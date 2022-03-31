import { createSelector } from '@reduxjs/toolkit'
import map from 'lodash/map'
import concat from 'lodash/concat'

export default createSelector(
  [state => state.forensics.streamsByRegion],
  streamsByRegion => {
    return concat(
      ...map(streamsByRegion, regionStreams =>
        regionStreams.filter(stream => stream.active).map(stream => stream.id),
      ),
    )
  },
)
