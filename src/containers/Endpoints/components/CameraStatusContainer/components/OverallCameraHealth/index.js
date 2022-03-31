/*
 * author: eric@ambient.ai
 */
import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
// import { RingGauge, CircularProgressPanel } from 'ambient_ui'
import { useSelector } from 'react-redux'
import { get } from 'lodash'
// src
import {
  EndpointHealthStatusPropType,
  EndpointHealthStatusPropTypeDefault,
} from 'common/data/proptypes'

const OverallCameraHealth = ({ graphVisible }) => {
  const { palette } = useTheme()
  // const darkMode = useSelector(state => state.settings.darkMode)
  const streamsHealth = useSelector(state => state.cameras.streamsHealth)
  const streamsHealthIds = useSelector(state => state.cameras.streamsHealthIds)
  // const streamsHealthLoading = useSelector(
  //   state => state.cameras.streamsHealthLoading,
  // )

  // const title = 'Overall Camera Health'

  // if (graphVisible && streamsHealthLoading) {
  //   return (
  //     <CircularProgressPanel
  //       title={title}
  //       darkMode={darkMode}
  //       style={{ height: 390, width: 364 }}
  //     />
  //   )
  // }

  const totalIds = streamsHealthIds || Object.keys(streamsHealth)
  // const totalCount = totalIds.length
  const healthyCount = streamsHealth
    ? totalIds
        .map(id => get(streamsHealth, `[${id}]`))
        .filter(s => get(s, 'status') === 'Healthy').length
    : 0

  // const info = [
  //   {
  //     label: 'Healthy',
  //     value: healthyCount,
  //     color: 'primary',
  //     selected: true,
  //   },
  //   {
  //     label: 'Unhealthy',
  //     value: totalCount - healthyCount,
  //     color: 'error',
  //     selected: false,
  //   },
  // ]

  // const newColorMap = {
  //   primary: palette.primary.main,
  //   secondary: palette.secondary.main,
  //   error: palette.error.main,
  // }

  // if (graphVisible) {
  //   return (
  //     <RingGauge
  //       darkMode={darkMode}
  //       title={title}
  //       data={info}
  //       total={totalCount}
  //       colorMap={newColorMap}
  //     />
  //   )
  // }

  return (
    <span className='am-overline' style={{ color: palette.grey[500] }}>
      Healthy:{' '}
      <span style={{ color: palette.common.greenBluePastel }}>
        {healthyCount}
      </span>
    </span>
  )
}

OverallCameraHealth.defaultProps = {
  streamsHealth: EndpointHealthStatusPropTypeDefault,
  streamsHealthIds: [],
}

OverallCameraHealth.propTypes = {
  streamsHealth: PropTypes.objectOf(EndpointHealthStatusPropType),
  streamsHealthIds: PropTypes.arrayOf(PropTypes.number),
}

export default OverallCameraHealth
