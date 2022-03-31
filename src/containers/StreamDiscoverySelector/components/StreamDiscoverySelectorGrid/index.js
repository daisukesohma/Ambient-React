import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import get from 'lodash/get'

import ExpandedStreamGrid from './ExpandedStreamGrid'
import GroupedStreamGrid from './GroupedStreamGrid'
import ActionTools from './components/ActionTools'

const StreamDiscoverySelectorGrid = () => {
  const isExpanded = useSelector(state =>
    get(state, 'streamDiscovery.expandedIp', false),
  )

  const [isMockData, setIsMockData] = useState(false)

  return (
    <>
      <ActionTools setIsMockData={setIsMockData} isMockData={isMockData} />
      {!isExpanded && <GroupedStreamGrid isMockData={isMockData} />}
      <ExpandedStreamGrid />
    </>
  )
}

export default StreamDiscoverySelectorGrid
