/* eslint react/prop-types: 0 */
/*
 * author: eric@ambient.ai
 * adapted from rodaan's dashboard components in Activity Dashboard
 */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
// import { BarGauge } from 'ambient_ui'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

export default function UnhealthyCameras() {
  const { palette } = useTheme()
  // const darkMode = useSelector(state => state.settings.darkMode)
  const streamsHealth = useSelector(state => state.cameras.streamsHealth)
  const streamsHealthIds = useSelector(state => state.cameras.streamsHealthIds)
  // const streamsHealthLoading = useSelector(
  //   state => state.cameras.streamsHealthLoading,
  // )

  // const title = 'Unhealthy Cameras'

  // if (streamsHealthLoading && streamsHealthIds && streamsHealth) {
  // if (graphVisible && streamsHealthLoading) {
  //   return (
  //     <CircularProgressPanel
  //       title={title}
  //       darkMode={darkMode}
  //       style={{ height: 390, width: 450 }}
  //     />
  //   )
  //   // return <CircularProgressPanel title={title} />
  // }

  // Calculate data
  const totalIds = streamsHealthIds || Object.keys(streamsHealth)
  const totalCount = totalIds.length
  const healthyCount = streamsHealth
    ? totalIds
        .map(id => get(streamsHealth, `[${id}]`))
        .filter(s => get(s, 'status') === 'Healthy').length
    : 0

  // may need loading state
  // if (graphVisible) {
  //   return (
  //     <BarGauge
  //       color='error'
  //       darkMode={darkMode}
  //       description='All cameras that are not healthy'
  //       title={title}
  //       total={totalCount}
  //       value={totalCount - healthyCount}
  //     />
  //   )
  // }

  return (
    <span className='am-overline' style={{ color: palette.grey[500] }}>
      Unhealthy:{' '}
      <span style={{ color: palette.error.main }}>
        {totalCount - healthyCount}
      </span>
    </span>
  )
}
