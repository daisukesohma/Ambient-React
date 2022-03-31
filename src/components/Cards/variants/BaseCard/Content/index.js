import React from 'react'
import PropTypes from 'prop-types'

import useStyles from './styles'

const propTypes = {
  children: PropTypes.node,
  darkMode: PropTypes.bool,
  inlineStyle: PropTypes.object,
}

const defaultProps = {
  darkMode: false,
  inlineStyle: {},
}

function Content({ children, darkMode, inlineStyle }) {
  const classes = useStyles({ darkMode })

  return (
    <div id='card-content' className={classes.root} style={inlineStyle}>
      {children}
    </div>
  )
}

Content.propTypes = propTypes
Content.defaultProps = defaultProps

export default Content
