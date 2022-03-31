import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import OverflowTip from 'components/OverflowTip'

import useStyles from './styles'

const LabelValue = ({ darkMode, label, value, isHorizontal }) => {
  const classes = useStyles({ darkMode })

  return (
    <div
      style={{ display: isHorizontal ? 'flex' : 'block', alignItems: 'center' }}
    >
      <div className={clsx('am-caption', classes.label)}>
        {label}
        {isHorizontal && ':'} &nbsp;
      </div>
      <div className={clsx('am-subtitle1', classes.value)}>
        <OverflowTip text={value} width={150} />
      </div>
    </div>
  )
}

LabelValue.defaultProps = {
  isHorizontal: false,
}

LabelValue.propTypes = {
  darkMode: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
}

export default LabelValue
