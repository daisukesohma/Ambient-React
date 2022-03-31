import React from 'react'
import PropTypes from 'prop-types'

export default function TooltipText({ children, text }) {
  return <div className='am-caption'>{text || children}</div>
}

TooltipText.defaultProps = {
  children: undefined,
  text: undefined,
}

TooltipText.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
}
