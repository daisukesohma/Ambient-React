import React from 'react'
import { useSelector } from 'react-redux'

import { NodeTypeEnum } from '../../constants'

import IncidentNode from './components/IncidentNode'
import useIncidentNodes from './hooks/useIncidentNodes'

const IncidentNodeContainer = () => {
  const incidentNodes = useSelector(state => state.forensics.incidentNodes)
  const regionStats = useSelector(state => state.forensics.regionStats)
  const [isDataUpdated] = useIncidentNodes() // eslint-disable-line

  return incidentNodes.length && regionStats
    ? incidentNodes.map((incidentNode, index) => {
        return (
          <IncidentNode
            key={`${NodeTypeEnum.INCIDENT}-${incidentNode.id}`}
            data={{
              ...IncidentNode,
            }}
            cx={incidentNode.cx}
            cy={incidentNode.cy}
            cxText={incidentNode.cxText}
            cyText={incidentNode.cyText}
            name={incidentNode.ts}
          />
        )
      })
    : false
}

export default IncidentNodeContainer
