import { createSelector } from '@reduxjs/toolkit'
import find from 'lodash/find'

export default createSelector(
  [state => state.cameras.sites, state => state.settings.selectedSite],
  (sites, selectedSiteSlug) => {
    if (sites && sites.length) {
      return find(sites, { slug: selectedSiteSlug })
    }

    return null
  },
)
