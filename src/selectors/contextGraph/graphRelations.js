import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default createSelector(
  [state => state.contextGraph.alerts],
  collection => {
    const relations = []

    collection.forEach(tsAlert => {
      get(tsAlert, 'defaultAlert.regions', []).forEach(region => {
        relations.push({
          regionId: region.id,
          threatSignatureId: tsAlert.id,
        })
      })
    })
    return relations
  },
)
