import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

import { formatUnixTimeToReadable } from '../../../../../../utils'
import { THIN_TIMELINE_HEIGHT } from '../../../MainTimeline/constants'

const MotionMarker = ({ endTs, startTs, width, x }) => {
  const { palette } = useTheme()
  return (
    <rect
      className='datapoint catalog'
      rx='3'
      data-readable-start={formatUnixTimeToReadable(startTs, true, true)}
      data-readable-end={formatUnixTimeToReadable(endTs, true, true)}
      data-start_ts={startTs}
      data-end_ts={endTs}
      fill={palette.primary.main}
      height={THIN_TIMELINE_HEIGHT}
      width={width}
      x='-1'
      transform={`translate(${x})`}
    />
  )
}

MotionMarker.defaultProps = {
  endTs: 0,
  startTs: 0,
  width: 0,
  x: 0,
}

MotionMarker.propTypes = {
  endTs: PropTypes.number,
  startTs: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
}

export default MotionMarker
