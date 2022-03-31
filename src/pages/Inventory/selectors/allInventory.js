import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

const allInventory = createSelector(
  state => get(state, 'inventory.collection', []),
  collection => {
    return collection
  },
)

export default allInventory
