import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { THIN_TIMELINE_HEIGHT } from '../../../MainTimeline/constants'

const WIDTH = 4
const HEIGHT = THIN_TIMELINE_HEIGHT / 2 // const OVERHANG = 2, HEIGHT = HEIGHT + OVERHANG

const EntityMarker = ({ ts, x, width, height, fill, y }) => {
  const readableTime = moment.unix(ts).format('hh:mm:ss')

  return (
    <rect
      className='datapoint metadata'
      rx={2}
      data-readable-start={readableTime}
      data-start_ts={ts}
      fill={fill}
      height={height}
      width={width}
      y={y}
      transform={`translate(${x})`}
    />
  )
}

EntityMarker.defaultProps = {
  ts: 0,
  x: -WIDTH / 2,
  width: WIDTH,
  height: HEIGHT,
  fill: '#FFC803',
  y: -HEIGHT,
}

EntityMarker.propTypes = {
  ts: PropTypes.number,
  x: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  y: PropTypes.number,
}
export default EntityMarker
