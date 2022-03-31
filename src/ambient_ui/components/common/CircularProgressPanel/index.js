import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'

import useStyles from './styles'

const CircularProgressPanel = ({
  color,
  darkMode,
  variant,
  title,
  ...props
}) => {
  const classes = useStyles({ darkMode })
  return (
    <Paper
      classes={{
        root: classes.root,
      }}
      {...props}
    >
      <div className={clsx('am-h6', classes.title)}>{title}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress
          className={classes.progress}
          color={color}
          variant={variant}
        />
      </div>
    </Paper>
  )
}

CircularProgressPanel.defaultProps = {
  color: 'primary',
  darkMode: false,
  variant: 'indeterminate',
  title: '',
}

CircularProgressPanel.propTypes = {
  color: PropTypes.string,
  darkMode: PropTypes.bool,
  variant: PropTypes.string,
  title: PropTypes.string,
}

export default CircularProgressPanel
