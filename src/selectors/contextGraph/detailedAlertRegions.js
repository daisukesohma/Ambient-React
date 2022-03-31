import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import map from 'lodash/map'
import compact from 'lodash/compact'

export default createSelector([state => state.contextGraph.detailed], alert => {
  return map(get(alert, 'defaultAlert.regions', []), region => {
    return {
      regionId: region.id,
      streamIds: compact(
        map(alert.streams, stream => {
          return stream.region.id === region.id ? stream.id : null
        }),
      ),
    }
  })
})
