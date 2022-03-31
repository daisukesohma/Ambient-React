import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

const allSkus = createSelector(
  state => get(state, 'skuManagement.collection', []),
  collection => {
    return collection
  },
)

export default allSkus
