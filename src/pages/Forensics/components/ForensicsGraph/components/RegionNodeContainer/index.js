import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { includes, get, map } from 'lodash'

import useRegionSelection from './hooks/useRegionSelection'
import useRegionNodes from './hooks/useRegionNodes'
import useForensicData from '../../../../hooks/useForensicData'
import RegionNode from './components/RegionNode'

function RegionNodeContainer({ graphSize, centerX, centerY }) {
  const activeRegions = useSelector(state => state.forensics.activeRegions)
  const hoveredRegion = useSelector(state => state.forensics.hoveredRegion)
  const regionNodes = useSelector(state => state.forensics.regionNodes)
  const regionStats = useSelector(state => state.forensics.regionStats)
  const [_, fetchEntities] = useForensicData()
  const selectedRegion = useSelector(state => state.forensics.selectedRegion)
  const { toggleSelectedRegion, getActiveRegions } = useRegionSelection()

  // eslint-disable-next-line
  const [isDataUpdated] = useRegionNodes({
    graphSize,
    centerX,
    centerY,
  })

  const getEffectDeps = useCallback(
    effect => {
      const regionDeps = activeRegions ? [...activeRegions] : []
      if (effect === 'hover') {
        regionDeps.push(hoveredRegion)
      }
      return { regionDeps }
    },
    [activeRegions, hoveredRegion],
  )

  const isActiveRegion = useCallback(
    (region, effect) => {
      const { regionDeps } = getEffectDeps(effect)

      return includes(regionDeps, region.id)
    },
    [getEffectDeps],
  )

  const onRegionClick = (event, region) => {
    fetchEntities({ regionIds: getActiveRegions(region.id) })
    toggleSelectedRegion(region.id)
  }

  return regionStats
    ? map(regionNodes, (node, index) => {
        const isSelected =
          activeRegions &&
          activeRegions.length === 1 &&
          node.id === activeRegions[0]

        return (
          <RegionNode
            data={{
              ...node,
              resultCount: get(
                regionStats.find(
                  stat => stat.regionPk.toString() === node.id.toString(),
                ),
                'count',
              ),
            }}
            cx={node.cx}
            cy={node.cy}
            centerX={centerX}
            centerY={centerY}
            isActive={isActiveRegion(node, 'active')}
            isHovered={isActiveRegion(node, 'hover')}
            isSelected={isSelected}
            hasSelected={!!selectedRegion}
            key={`regionNode-${index}`}
            onClick={onRegionClick}
          />
        )
      })
    : false
}

export default RegionNodeContainer
