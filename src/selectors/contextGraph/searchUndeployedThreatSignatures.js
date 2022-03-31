import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

// @FUTURE @ERIC  use fuse.js

export default createSelector(
  [
    state => state.contextGraph.defaultAlerts,
    state => state.contextGraph.alerts,
    state => state.contextGraph.search,
  ],
  (allAlerts, allDeployed, search) => {
    return allAlerts.filter(tsAlert => {
      const searchTerm = search.toLocaleLowerCase()

      const isDeployed = allDeployed
        .map(d => d.defaultAlert)
        .some(defaultAlert => get(defaultAlert, 'id') === get(tsAlert, 'id'))

      // self search by threatSignatureName
      const isNameMatched = tsAlert.threatSignature.name
        .toLocaleLowerCase()
        .includes(searchTerm)

      // search by region names
      const isRegionMatched = tsAlert.regions.some(region => {
        return region.name.toLocaleLowerCase().includes(searchTerm)
      })

      // search by not deployed AND matches name OR region
      return !isDeployed && (isNameMatched || isRegionMatched)
    })
  },
)
