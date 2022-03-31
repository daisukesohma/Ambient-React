import React from 'react'
import PropTypes from 'prop-types'

import { formatUnixTimeToReadable } from '../../../../../utils'

const AlertMarker = ({ onClick, onMouseOver, onMouseLeave, ts, x, color }) => {
  const readableTime = formatUnixTimeToReadable(ts, true, true)
  const SIDE = Math.sqrt(50) // 20^2 / 2, since height is 20, and it is rotated

  // we can layer a larger transparent diamond on top of the visible red diamond to enlarge the hitbox
  const SIDE_HITBOX = 30

  //

  // Note: @FUTURE @Eric: we can maybe create click-to-enlarge
  // or hover-to-engarge
  // also, grouping alerts when they are too close together is nice

  return (
    <g>
      <rect
        className='datapoint alert'
        style={{ cursor: 'pointer' }}
        data-readable-start={readableTime}
        data-readable-end={readableTime}
        data-start_ts={ts}
        data-end_ts={ts}
        fill={color}
        height={SIDE}
        width={SIDE}
        transform={`
          translate(${x}, ${-SIDE / 2})
          rotate(45)
        `}
      />
      <rect
        className='datapoint-alert-hitbox'
        style={{ cursor: 'pointer' }}
        fill='transparent'
        height={SIDE_HITBOX}
        width={SIDE_HITBOX}
        transform={`
          translate(${x}, ${-SIDE_HITBOX / 2 - 15})
          rotate(45)
        `}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseLeave}
      />
    </g>
  )
}

AlertMarker.defaultProps = {
  onClick: () => {},
  onMouseOver: () => {},
  onMouseLeave: () => {},
  ts: 0,
  x: 0,
  color: '#FD235C',
}

AlertMarker.propTypes = {
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  ts: PropTypes.number,
  x: PropTypes.number,
  color: PropTypes.string,
}
export default AlertMarker
