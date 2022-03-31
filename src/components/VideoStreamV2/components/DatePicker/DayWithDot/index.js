import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

const DayWithDot = ({ day }) => {
  const { palette } = useTheme()
  return (
    <div style={{ position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          width: 3,
          height: 3,
          top: -2,
          right: 7,
          background: palette.error.main,
          borderRadius: '50%',
        }}
      />
      <span>{day.format('D')}</span>
    </div>
  )
}

DayWithDot.defaultProps = {
  day: {
    format: () => {},
  },
}

DayWithDot.propTypes = {
  day: PropTypes.object,
}
export default DayWithDot
