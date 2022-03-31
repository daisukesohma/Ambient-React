import { createSelector } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

export default createSelector(
  [
    state => state.verification.sites,
    state => state.verification.historicalFilter.sites,
    state => state.verification.streams,
  ],
  (sites, selectedSites, streams) => {
    if (isEmpty(selectedSites)) return streams
    const filteredSites = filter(sites, site =>
      includes(selectedSites, site.id),
    )
    const slugs = map(filteredSites, 'slug')
    return filter(streams, ({ stream }) =>
      includes(slugs, get(stream, 'site.slug')),
    )
  },
)
