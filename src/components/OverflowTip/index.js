import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'

const defaultProps = {
  placement: 'bottom',
}

const propTypes = {
  text: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  placement: PropTypes.string,
}

function OverflowTip({ text, className, width, placement }) {
  const textElementRef = useRef()
  const [hoverStatus, setHover] = useState(false)

  const compareSize = () => {
    const compare =
      textElementRef.current.scrollWidth > textElementRef.current.clientWidth
    setHover(compare)
  }

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => window.removeEventListener('resize', compareSize)
  }, [])

  return (
    <Tooltip
      title={text}
      interactive
      disableHoverListener={!hoverStatus}
      placement={placement}
    >
      <div
        ref={textElementRef}
        className={className}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width,
        }}
      >
        {text}
      </div>
    </Tooltip>
  )
}

OverflowTip.propTypes = propTypes

OverflowTip.defaultProps = defaultProps

export default OverflowTip
