import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { getMinutes } from 'date-fns'

const propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired,
}

const defaultProps = {
  format: d => d,
}

const Tick = ({ tick, count, format }) => {
  const isFullHour = useMemo(() => !getMinutes(tick.value), [tick])

  const tickLabelStyle = useMemo(
    () => ({
      marginLeft: `${-(100 / count) / 2}%`,
      width: `${100 / count}%`,
      left: `${tick.percent}%`,
    }),
    [tick, count],
  )

  return (
    <>
      <div
        className={`react_time_range__tick_marker${
          isFullHour ? '__large' : ''
        }`}
        style={{ left: `${tick.percent}%` }}
      />
      {isFullHour && (
        <div className='react_time_range__tick_label' style={tickLabelStyle}>
          {format(tick.value)}
        </div>
      )}
    </>
  )
}

Tick.propTypes = propTypes
Tick.defaultProps = defaultProps

export default memo(Tick)
