import { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// src
import forensicsRegions from 'selectors/forensics/regions'
import {
  updateStreamNodeData,
  updateStreamNodes,
} from 'redux/forensics/actions'

import { NodeTypeEnum } from '../../../constants'
import {
  determineCoordinates,
  distance,
  generateStreamNodeData,
} from '../../../utils'

// const EDGE_LENGTH_FACTOR = 1
const isDisplayingStreamNodes = true
const isLimitingStreamNodes = true
const STREAM_NODES_LIMIT = 35

const useStreamNodes = ({ centerX, centerY, graphSize }) => {
  const [isDataUpdated, setIsDataUpdated] = useState(false)
  const activeRegions = useSelector(state => state.forensics.activeRegions)
  const determineNodeCoordinates = useCallback(determineCoordinates, [distance])
  const dispatch = useDispatch()
  const graphPage = useSelector(state => state.forensics.graphPage)
  const regionNodes = useSelector(state => state.forensics.regionNodes)
  const regions = useSelector(forensicsRegions)
  const streamNodeData = useSelector(state => state.forensics.streamNodeData)
  const streamsByRegion = useSelector(state => state.forensics.streamsByRegion)
  const streamStats = useSelector(state => state.forensics.streamStats)

  useEffect(() => {
    // For stream nodes
    if (
      regions.length > 0 &&
      regionNodes.length > 0 &&
      isDisplayingStreamNodes &&
      activeRegions.length === 1 // Only render stream nodes when there is one active region
    ) {
      let newStreamNodeData = []

      const regionId = activeRegions[0] // select only first region
      const matchingRegion = regionNodes.find(
        node => node.id.toString() === regionId.toString(),
      )

      if (matchingRegion) {
        const regionStreamNodes = generateStreamNodeData(
          streamsByRegion[regionId],
          matchingRegion,
          streamStats,
          centerX,
          centerY,
        )
        // Prioritize showing stream nodes with results
        regionStreamNodes.sort((a, b) => b.hasResults - a.hasResults)
        newStreamNodeData = newStreamNodeData.concat(regionStreamNodes)
      }

      dispatch(
        updateStreamNodeData({
          streamNodeData: newStreamNodeData,
          totalGraphPages: Math.ceil(
            newStreamNodeData.length / STREAM_NODES_LIMIT,
          ),
        }),
      )
    }
  }, [
    streamsByRegion,
    regions,
    regionNodes,
    dispatch,
    determineNodeCoordinates,
    streamStats,
    activeRegions,
    centerX,
    centerY,
  ])

  useEffect(() => {
    // Creates Stream Nodes
    if (streamNodeData.length > 0) {
      const regionStreamNodeDataTotal = streamNodeData.length

      const displayedStreamNodes = streamNodeData.slice(
        STREAM_NODES_LIMIT * (graphPage - 1),
        STREAM_NODES_LIMIT * graphPage,
      )
      if (
        isLimitingStreamNodes &&
        regionStreamNodeDataTotal > STREAM_NODES_LIMIT
      ) {
        displayedStreamNodes.push({
          id: null,
          name: `+${regionStreamNodeDataTotal - STREAM_NODES_LIMIT} more`,
          parentCx: streamNodeData[0].parentCx,
          parentCy: streamNodeData[0].parentCy,
          regionId: streamNodeData[0].regionId,
        })
      }

      // const distanceBetweenRegionNodes =
      //   distance(
      //     regionNodes[0].cx,
      //     regionNodes[0].cy,
      //     regionNodes[1].cx,
      //     regionNodes[1].cy,
      //   ) * (EDGE_LENGTH_FACTOR || 1)

      const enrichedStreamNodes = determineNodeCoordinates(
        displayedStreamNodes,
        NodeTypeEnum.STREAM,
        graphSize,
        false,
      )
      dispatch(
        updateStreamNodes({
          streamNodes: enrichedStreamNodes,
        }),
      )
      setIsDataUpdated(true)
    }
  }, [
    streamNodeData,
    graphPage,
    determineNodeCoordinates,
    dispatch,
    regionNodes,
    graphSize,
  ])

  return [isDataUpdated]
}

export default useStreamNodes
