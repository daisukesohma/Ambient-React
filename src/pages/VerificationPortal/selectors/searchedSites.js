import { createSelector } from '@reduxjs/toolkit'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

export default createSelector(
  [state => state.verification.sites, state => state.verification.sitesQuery],
  (sites, sitesQuery) =>
    filter(sites, site =>
      includes(
        `${site.account.name} - ${site.name}`.toLocaleLowerCase(),
        sitesQuery.toLocaleLowerCase(),
      ),
    ),
)
