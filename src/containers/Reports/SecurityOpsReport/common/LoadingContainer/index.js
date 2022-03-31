import React from 'react'
import PropTypes from 'prop-types'

// src
import { CircularProgressPanel } from 'ambient_ui'
import useStyles from './style'

const defaultProps = {
  title: '',
  darkMode: false,
}

const propTypes = {
  title: PropTypes.string,
  darkMode: PropTypes.bool,
}

export default function LoadingContainer({ title, darkMode }) {
  const classes = useStyles()

  return (
    <div className={classes.loadingContainer}>
      <CircularProgressPanel title={title} darkMode={darkMode} />
    </div>
  )
}

LoadingContainer.propTypes = propTypes
LoadingContainer.defaultProps = defaultProps
