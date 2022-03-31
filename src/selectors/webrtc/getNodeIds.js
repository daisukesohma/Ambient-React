import { createSelector } from '@reduxjs/toolkit'
import map from 'lodash/map'

export default createSelector(
  [state => state.auth.nodes],
  nodes => map(nodes, 'identifier'),
)
