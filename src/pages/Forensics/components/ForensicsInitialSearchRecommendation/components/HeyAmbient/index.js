import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useSpring, useTrail, animated } from 'react-spring'
import { useCursorStyles } from 'common/styles/commonStyles'

import useStyles from './styles'

function HeyAmbient({ item, onItemClick }) {
  const classes = useStyles()
  const cursorClasses = useCursorStyles()
  const [isAnimated, setIsAnimated] = useState(false)

  const { x, opacity } = useSpring({
    from: { opacity: 0, x: 300 },
    to: {
      opacity: isAnimated ? 1 : 0,
      x: isAnimated ? 0 : 300,
    },
  })

  const trail = useTrail(item.length, {
    from: { opacity: 0, xTrail: 20, height: 0 },
    to: {
      opacity: isAnimated ? 1 : 0,
      xTrail: isAnimated ? 0 : 20,
      height: isAnimated ? 24 : 0,
    },
    delay: 500,
  })

  useEffect(() => {
    setIsAnimated(true)
  }, [])

  return (
    <div>
      <div className={clsx(classes.titleContainer)}>
        <animated.div
          className={clsx('am-h4')}
          style={{
            opacity,
            transform: x.interpolate(xValue => `translate3d(0,${xValue}px,0)`),
          }}
        >
          Hey Ambient, show me...
        </animated.div>
      </div>
      <div className={clsx('am-body1', classes.main)} onClick={onItemClick}>
        {trail.map(({ xTrail, height, ...rest }, index) => (
          <animated.div
            key={`${index}`}
            className={clsx(classes.trailsText, cursorClasses.pointer)}
            style={{
              ...rest,
              transform: xTrail.interpolate(
                xTrailValue => `translate3d(0,${xTrailValue}px,0)`,
              ),
            }}
          >
            <animated.div style={{ height }}>{item[index]}</animated.div>
          </animated.div>
        ))}
      </div>
    </div>
  )
}

HeyAmbient.propTypes = {
  item: PropTypes.array,
  onItemClick: PropTypes.func,
}

HeyAmbient.defaultProps = {
  item: [],
  onItemClick: () => {},
}
export default HeyAmbient
