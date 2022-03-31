import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ErrorIcon from '@material-ui/icons/Error'
import Paper from '@material-ui/core/Paper'

import '../design_system/Theme.css'

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
  root: {
    padding: '17px',
  },
}))

const ErrorPanel = ({ title, message }) => {
  const { palette } = useTheme()
  const classes = useStyles()
  return (
    <Paper classes={{ root: classes.root }} style={{ height: '100%' }}>
      <h6>{title}</h6>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <ErrorIcon
            className={classes.progress}
            color='error'
            fontSize='large'
          />
          <div className='am-caption' style={{ color: palette.grey[500] }}>
            {message}
          </div>
        </div>
      </div>
    </Paper>
  )
}

ErrorPanel.defaultProps = {
  title: '',
  message: '',
}

ErrorPanel.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
}

export default ErrorPanel
