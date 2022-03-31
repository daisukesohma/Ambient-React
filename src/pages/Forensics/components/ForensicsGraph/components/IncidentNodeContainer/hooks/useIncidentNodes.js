import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import forensicsRegions from 'selectors/forensics/regions'
import { updateIncidentNodes } from 'redux/forensics/actions'

import { NodeTypeEnum } from '../../../constants'
import { distance, determineCoordinates } from '../../../utils'

const isDisplayingIncidentNodes = false
const isCenteringNodes = true

const useIncidentNodes = () => {
  const [isDataUpdated, setIsDataUpdated] = useState(false)
  const regions = useSelector(forensicsRegions)
  const dispatch = useDispatch()
  const searchResults = useSelector(state => state.forensics.searchResults)
  const regionNodes = useSelector(state => state.forensics.regionNodes)
  const determineNodeCoordinates = useCallback(determineCoordinates, [distance])

  useEffect(() => {
    // For incident nodes
    if (
      regions.length > 0 &&
      regionNodes.length > 0 &&
      searchResults.length > 0 &&
      isDisplayingIncidentNodes
    ) {
      const newIncidentNodes = []
      for (let i = 0; i < searchResults.length; ++i) {
        const parentNode = regionNodes.find(
          node => node.id === searchResults[i].stream.id,
        )

        const incidentNode = {
          id: searchResults[i].ts,
          ts: searchResults[i].ts,
          parentCx: parentNode.cx,
          parentCy: parentNode.cy,
        }

        newIncidentNodes.push(incidentNode)
      }

      const distanceBetweenRegionNodes = distance(
        regionNodes[0].cx,
        regionNodes[0].cy,
        regionNodes[1].cx,
        regionNodes[1].cy,
      )

      const enrichedIncidentNodes = determineNodeCoordinates(
        newIncidentNodes,
        NodeTypeEnum.INCIDENT,
        distanceBetweenRegionNodes,
        isCenteringNodes,
      )
      dispatch(updateIncidentNodes(enrichedIncidentNodes))
      setIsDataUpdated(true)
    }
  }, [
    // eslint-disable-line
    searchResults,
    regionNodes,
    dispatch,
    determineNodeCoordinates,
    regions.length,
  ])

  return [isDataUpdated]
}

export default useIncidentNodes
