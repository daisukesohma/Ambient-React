import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
// src
import OverflowTip from 'components/OverflowTip'

import useStyles from './styles'

const defaultProps = {
  content: '',
  children: null,
  color: '#9FA2A7',
  inlineTooltip: false,
  toolTipWidth: '100%',
  backgroundColor: 'none',
  lowercase: false,
}

const propTypes = {
  content: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  inlineTooltip: PropTypes.bool,
  toolTipWidth: PropTypes.string,
  backgroundColor: PropTypes.string,
  lowercase: PropTypes.bool,
}

function SimpleLabel({
  children,
  content,
  color,
  inlineTooltip,
  toolTipWidth,
  backgroundColor,
  lowercase,
}) {
  const classes = useStyles({ color, toolTipWidth, backgroundColor })

  return (
    <span
      className={clsx(
        lowercase ? '' : 'am-overline',
        classes.labelType,
        backgroundColor !== 'none' ? classes.background : '',
        inlineTooltip ? classes.inlineRoot : '',
      )}
    >
      <span>{content}</span>
      {inlineTooltip ? (
        <OverflowTip text={children} width={toolTipWidth} placement='top' />
      ) : (
        <span>{children}</span>
      )}
    </span>
  )
}

SimpleLabel.defaultProps = defaultProps

SimpleLabel.propTypes = propTypes

export default SimpleLabel
