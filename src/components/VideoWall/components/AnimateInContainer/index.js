import React from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'framer-motion'

const DURATION = 0.3

const getStartXFromPosition = startPosition => {
  if (startPosition === 'left') {
    return -100
  }
  if (startPosition === 'right') {
    return 100
  }
  return -100
}

const AnimateInContainer = ({ children, duration, from }) => {
  const startX = getStartXFromPosition(from)
  const endX = 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          transform: `translateX(${startX}%)`,
        }}
        animate={{
          transform: `translateX(${endX}%)`,
          transition: {
            duration,
            ease: 'easeInOut',
          },
        }}
        exit={{
          transform: `translateX(${-startX}%)`,
          transition: {
            duration,
            ease: 'easeInOut',
          },
        }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

AnimateInContainer.defaultProps = {
  children: null,
  duration: DURATION,
  from: 'left',
}

AnimateInContainer.propTypes = {
  children: PropTypes.node,
  duration: PropTypes.number,
  from: PropTypes.oneOf(['left', 'right']),
}
export default AnimateInContainer
