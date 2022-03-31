import { createSelector } from '@reduxjs/toolkit'
import get from 'lodash/get'
import { arrayGroupBy } from 'utils'

// Set NodeToRequestMap
// We grouped by requestType within each nodeId key
// nodeToRequestMap example object is ie.
// {
//     nodeIdKey: {
//       RESTART: [{ id, status }],
//       UPGRADE: [{ id, status }]
//     }
// }
//
//
const formatNodeRequestData = createSelector(
  [
    state => state.appliances.nodeRequestData,
    state => state.appliances.collection,
  ],
  (nodeRequestData, collection) => {
    if (
      collection &&
      collection.length > 0 &&
      get(nodeRequestData, 'getNodeRequestStatusByAccount')
    ) {
      const NODE_IDENTIFIER = 'NODE_IDENTIFIER'

      // Intermediate representation
      const requests = nodeRequestData.getNodeRequestStatusByAccount.map(r => {
        const enhanced = { ...r }
        enhanced[NODE_IDENTIFIER] = r.node.identifier // Put identifier at top level
        return enhanced
      })

      // First grouping by Node Identifier
      //  grouped =  {
      //    acme: [{ id, requestType, status, createdTs}, { ... }],
      // }
      const groupedByNodeId = arrayGroupBy(NODE_IDENTIFIER)(requests) // grouped requests by Node identifier

      const map = {}
      Object.keys(groupedByNodeId).forEach(nodeId => {
        map[nodeId] = arrayGroupBy('requestType')(groupedByNodeId[nodeId])
      })
      return map
    }

    return null
  },
)

export default formatNodeRequestData
