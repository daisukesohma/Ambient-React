import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import useStyles from './styles'

const LivePulse = ({ color, rippleColor, style, pulseSize }) => {
  const classes = useStyles({ rippleColor, style, pulseSize })

  const containerClass = clsx(
    classes.live,
    { [classes.rippleWhite]: rippleColor === 'white' && pulseSize >= 6 },
    { [classes.rippleRed]: rippleColor === 'red' && pulseSize >= 6 },
    {
      [classes.rippleSecondary]: rippleColor === 'secondary' && pulseSize >= 6,
    },
    { [classes.rippleYellow]: rippleColor === 'yellow' && pulseSize >= 6 },
    { [classes.rippleWhiteSmall]: rippleColor === 'white' && pulseSize < 6 },
    { [classes.rippleRedSmall]: rippleColor === 'red' && pulseSize < 6 },
    {
      [classes.rippleSecondarySmall]:
        rippleColor === 'secondary' && pulseSize < 4,
    },
    {
      [classes.rippleYellowSmall]: rippleColor === 'yellow' && pulseSize < 6,
    },
  )

  return <span className={containerClass} style={{ background: color }} />
}

LivePulse.defaultProps = {
  color: '#FD235C',
  rippleColor: 'white',
  pulseSize: 6,
  style: {},
}

LivePulse.propTypes = {
  color: PropTypes.string,
  rippleColor: PropTypes.string,
  style: PropTypes.object,
  pulseSize: PropTypes.number,
}
export default LivePulse
