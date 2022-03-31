import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import { useStyles } from './styles'

const AlertLevelLabel = ({
  children,
  darkMode,
  label,
  level,
  classOverride,
}) => {
  const classes = useStyles({ darkMode, level })
  return (
    <div
      id='alert-level-label'
      className={clsx(classes.levelLabel, classes.levelColor, classOverride)}
    >
      <div className='am-overline'>
        {children}
        {!children && (label || level)}
      </div>
    </div>
  )
}

AlertLevelLabel.propTypes = {
  children: PropTypes.node,
  darkMode: PropTypes.bool,
  label: PropTypes.string,
  level: PropTypes.oneOf(['high', 'medium', 'low']),
  classOverride: PropTypes.string,
}

AlertLevelLabel.defaultProps = {
  classOverride: null,
}

export default AlertLevelLabel
