import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { Icons } from 'ambient_ui'

const { Zap } = Icons

function MotionContent() {
  const { palette } = useTheme()
  return (
    <div style={styles.container}>
      <Zap
        width={18}
        height={18}
        strokeWidth={1}
        stroke={palette.error.main}
        fill={palette.warning.main}
      />
      <span>Motion</span>
    </div>
  )
}

const styles = {
  container: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: 0.4,
    display: 'flex',
  },
}

MotionContent.defaultProps = {
  format: '12h',
  ts: undefined,
}

MotionContent.propTypes = {
  format: PropTypes.oneOf(['12h', '24h']),
  ts: PropTypes.number,
}

export default MotionContent
