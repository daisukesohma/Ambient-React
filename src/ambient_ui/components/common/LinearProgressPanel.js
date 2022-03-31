import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(({ spacing }) => ({
  progress: {
    margin: spacing(2),
  },
  root: {
    padding: '32px',
  },
}))

const LinearProgressPanel = ({ color, variant }) => {
  const classes = useStyles()
  return (
    <Paper
      classes={{ root: classes.root }}
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LinearProgress
        className={classes.progress}
        color={color}
        variant={variant}
      />
    </Paper>
  )
}

LinearProgressPanel.defaultProps = {
  color: 'primary',
  variant: 'indeterminate',
}

LinearProgressPanel.propTypes = {
  color: PropTypes.string,
  variant: PropTypes.string,
}

export default LinearProgressPanel
