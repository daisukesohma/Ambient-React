import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'

export default createSelector(
  [
    state => state.streamConfiguration.shapes,
    state => state.streamConfiguration.selectedBoundingBoxEntityId,
  ],
  (shapes, entityId) => shapes.find(s => get(s, 'meta.id') === entityId),
)
