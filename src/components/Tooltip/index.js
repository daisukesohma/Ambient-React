import React from 'react'
import PropTypes from 'prop-types'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // eslint-disable-line import/no-extraneous-dependencies
import 'tippy.js/animations/scale-subtle.css' // eslint-disable-line import/no-extraneous-dependencies
import TooltipText from './TooltipText'
// when using theme prop, remove 'tippy-' and '-theme' from css filename for theme name
// ie. 'ambient-theme'
import './tippy-ambient-theme.css' // ie. theme: 'ambient'
import './tippy-ambient-dark-theme.css' // ie. theme: 'ambient-dark'
import './tippy-ambient-naked-theme.css'
import './tippy-ambient-naked-opaque-theme.css' // opacity: 1
import './tippy-ambient-white-theme.css'
import './tippy-ambient-yellow-theme.css'

const DEFAULT_VISIBLE = undefined // if visible is passed as a boolean prop, Tippy becomes controlled, else it defaults

// other props available here: https://atomiks.github.io/tippyjs/v6/all-props/
// including offset
const Tooltip = ({
  animation,
  arrow,
  content,
  children,
  duration,
  placement,
  theme,
  visible,
  innerSpanStyles,
  ...props
}) => {
  const contents = innerSpanStyles ? (
    <span style={innerSpanStyles}>{children}</span>
  ) : (
    <span>{children}</span>
  )

  return (
    <Tippy
      {...(visible !== DEFAULT_VISIBLE && { visible })}
      {...props}
      theme={theme}
      animation={animation}
      content={content}
      placement={placement}
      arrow={arrow}
      duration={duration}
    >
      {contents}
    </Tippy>
  )
}

Tooltip.defaultProps = {
  animation: 'scale-subtle',
  arrow: false,
  content: '',
  children: null,
  duration: [100, 200],
  placement: 'top',
  theme: 'ambient',
  visible: DEFAULT_VISIBLE,
  innerSpanStyles: null,
}

Tooltip.propTypes = {
  animation: PropTypes.string,
  arrow: PropTypes.bool,
  children: PropTypes.element,
  content: PropTypes.any,
  duration: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  placement: PropTypes.string,
  theme: PropTypes.string,
  visible: PropTypes.bool,
  innerSpanStyles: PropTypes.object,
}

export default Tooltip
export { TooltipText }
