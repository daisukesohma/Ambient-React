import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'
import get from 'lodash/get'
import toString from 'lodash/toString'

import Cell from './Cell'

function stripeShade(rowNum, color) {
  if (rowNum % 2 === 0) {
    return {
      backgroundColor: color,
    }
  }
  return {
    backgroundColor: Color(color).lighten(0.09),
  }
}
const TimeRow = ({ rowNumber, dayItems, minutesInCell }) => {
  let rowHour
  const isRowHeader = rowNumber % (60 / minutesInCell) === 0
  if (isRowHeader) {
    rowHour = rowNumber === 0 ? 0 : Math.floor(rowNumber / (60 / minutesInCell))
  }

  return (
    <tr>
      {isRowHeader && (
        <td className='hour' rowSpan={`${60 / minutesInCell}`}>
          <span>{`${rowHour}:00`}</span>
        </td>
      )}
      {dayItems.map((day, index) => (
        <Cell
          key={index}
          dayNum={index}
          rowNum={rowNumber}
          bgColor={stripeShade(rowNumber, get(day, 'color'))}
        />
      ))}
    </tr>
  )
}

TimeRow.defaultProps = {
  rowNumber: 0,
  dayItems: [],
  minutesInCell: 30,
}

TimeRow.propTypes = {
  rowNumber: PropTypes.number,
  dayItems: PropTypes.array,
  minutesInCell: PropTypes.number,
}

export default TimeRow
