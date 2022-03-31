import React from 'react'
import { Box } from '@material-ui/core'
import { useFlexStyles } from 'common/styles/commonStyles'
import clsx from 'clsx'

import OverallCameraHealth from './components/OverallCameraHealth'
import UnhealthyCameras from './components/UnhealthyCameras'

export default function CameraStatusContainer() {
  const flexClasses = useFlexStyles()
  return (
    <Box
      mb={0.5}
      mt={0.5}
      className={clsx(flexClasses.row, flexClasses.centerAround)}
    >
      <Box mr={3}>
        <OverallCameraHealth graphVisible={false} />
      </Box>
      <div>
        <UnhealthyCameras graphVisible={false} />
      </div>
    </Box>
  )
}
