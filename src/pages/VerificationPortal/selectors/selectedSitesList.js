import { createSelector } from '@reduxjs/toolkit'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

export default createSelector(
  [
    state => state.verification.sites,
    state => state.verification.selectedSites,
  ],
  (sites, selectedSites) => {
    return filter(sites, site => includes(selectedSites, site.id))
  },
)
