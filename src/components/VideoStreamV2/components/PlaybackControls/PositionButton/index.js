import React from 'react'
import PropTypes from 'prop-types'
import { FiChevronsDown, FiChevronsUp } from 'react-icons/fi'

const PositionButton = ({ position }) => {
  const isOverlay = position === 'overlay'
  const positionButton = isOverlay ? <FiChevronsDown /> : <FiChevronsUp />
  return <span style={{ cursor: 'pointer' }}>{positionButton}</span>
}

PositionButton.defaultProps = {
  position: 'below',
}
PositionButton.propTypes = {
  position: PropTypes.oneOf(['below', 'overlay']),
}

export default PositionButton
