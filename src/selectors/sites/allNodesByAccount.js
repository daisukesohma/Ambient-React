import { createSelector } from '@reduxjs/toolkit'
import each from 'lodash/each'

const allNodesByAccount = createSelector(
  state => state.site.collection,
  collection => {
    const nodesSet = []
    each(collection, site => {
      each(site.nodes, node => {
        nodesSet.push({
          identifier: node.identifier,
          name: node.name,
          buildVersion: node.buildVersion,
          site: {
            slug: site.slug,
            name: site.name,
          },
        })
      })
    })

    return nodesSet
  },
)

export default allNodesByAccount
