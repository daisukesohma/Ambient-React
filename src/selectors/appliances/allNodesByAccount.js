import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'
import get from 'lodash/get'

const allNodesByAccount = createSelector(
  state => get(state, 'appliances.collection', []),
  collection => {
    const nodesSet = []
    each(collection, node => {
      nodesSet.push({
        identifier: node.identifier,
        name: node.name,
        buildVersion: node.buildVersion,
      })
    })

    return nodesSet
  },
)

export default allNodesByAccount
