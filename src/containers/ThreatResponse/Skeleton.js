import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    marginTop: 140,
  },
}))

const EscalationSkeleton = () => {
  const classes = useStyles()

  return (
    <div className='app'>
      <div className={classes.root}>
        <CircularProgress size={32} />
      </div>
    </div>
  )
}

export default EscalationSkeleton
