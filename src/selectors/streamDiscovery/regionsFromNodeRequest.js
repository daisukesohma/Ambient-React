import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

// TODO: TURNKEY need to change this reference to node.site
export default createSelector(
  [
    state =>
      get(state, 'streamDiscovery.nodeRequest.node.site.siteType.regions', []),
  ],
  regions => {
    return regions.map(region => ({
      value: region.id,
      label: region.name,
    }))
  },
)
