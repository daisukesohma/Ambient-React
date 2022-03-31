import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default createSelector(
  [state => state.contextGraph.alerts, state => state.contextGraph.search],
  (tsAlerts, search) => {
    return tsAlerts.filter(tsAlert => {
      const searchTerm = search.toLocaleLowerCase()

      // self search by threatSignatureName
      const isNameMatched = tsAlert.name
        .toLocaleLowerCase()
        .includes(searchTerm)

      // search by region names
      const isRegionMatched = get(tsAlert, 'defaultAlert.regions', []).some(
        region => {
          return region.name.toLocaleLowerCase().includes(searchTerm)
        },
      )

      const isStreamMatched = tsAlert.streams.some(stream => {
        return stream.name.toLocaleLowerCase().includes(searchTerm)
      })
      return isNameMatched || isRegionMatched || isStreamMatched
    })
  },
)
