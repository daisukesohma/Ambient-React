import { createSelector } from '@reduxjs/toolkit'
import find from 'lodash/find'
import get from 'lodash/get'

const provisionNewSku = createSelector(
  [
    state => get(state, 'skuManagement.collection', []),
    state => get(state, 'skuManagement.provisionNewModal.id', null),
  ],
  (collection, id) => {
    if (id) {
      return find(collection, { id })
    }

    return null
  },
)

export default provisionNewSku
