import React from 'react'
import PropTypes from 'prop-types'

const Cell = ({ dayNum, rowNum, bgColor }) => (
  <td className='cell' data-day={dayNum} data-row={rowNum} style={bgColor} />
)

Cell.defaultProps = {
  dayNum: 0,
  rowNum: 0,
  bgColor: { backgroundColor: 'white' },
}

Cell.propTypes = {
  dayNum: PropTypes.number,
  rowNum: PropTypes.number,
  bgColor: PropTypes.object,
}

export default Cell
