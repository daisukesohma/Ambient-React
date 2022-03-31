import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// src
import { addRegionNodes, addViableRegionsCount } from 'redux/forensics/actions'
import forensicsRegions from 'selectors/forensics/regions'

import { determineCoordinates } from '../../../utils'
import { NodeTypeEnum } from '../../../constants'

const useRegionNodes = ({ graphSize, centerX, centerY }) => {
  const [isDataUpdated, setIsDataUpdated] = useState(false)
  const dispatch = useDispatch()
  const regions = useSelector(forensicsRegions)
  const regionStats = useSelector(state => state.forensics.regionStats)
  const streamsByRegion = useSelector(state => state.forensics.streamsByRegion)

  const determineRegionCoordinates = useCallback(determineCoordinates, [
    graphSize,
    centerX,
    centerY,
  ])

  // generate nodes, and filter by 1) regionStat values 2) has streams
  // get node positions
  const getAllRegionsWithStatsAndStreams = useCallback(() => {
    return regions.filter(r => {
      const hasStats = regionStats.map(rs => rs.regionPk).includes(r.id)
      const hasStreams = streamsByRegion[r.id] // undefined if doesnt exist
      return hasStats && hasStreams
    })
  }, [regions, regionStats, streamsByRegion])

  // Region nodes
  useEffect(() => {
    if (regionStats.length > 0 && regions.length > 0) {
      const allRegionsWithStats = getAllRegionsWithStatsAndStreams()
      const regionsWithParent = allRegionsWithStats.map(region => {
        return {
          ...region,
          parentCx: centerX,
          parentCy: centerY,
        }
      })

      dispatch(addViableRegionsCount(allRegionsWithStats.length))

      if (graphSize) {
        const enrichedRegions = determineRegionCoordinates(
          regionsWithParent,
          NodeTypeEnum.REGION,
          graphSize,
          false,
        )
        dispatch(addRegionNodes(enrichedRegions))
        setIsDataUpdated(true)
      }
    }
  }, [
    // eslint-disable-line
    regionStats,
    regions,
    determineRegionCoordinates,
    streamsByRegion,
    dispatch,
    graphSize,
    centerX,
    centerY,
    getAllRegionsWithStatsAndStreams,
  ]) // eslint-disable-line

  return [isDataUpdated]
}

export default useRegionNodes
