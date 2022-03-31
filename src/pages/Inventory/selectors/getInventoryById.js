import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

const getInventoryById = id => {
  return createSelector(
    state => get(state, 'inventory.collection', []),
    collection => collection.find(c => c.id === id),
  )
}

export default getInventoryById
