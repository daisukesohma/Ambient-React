import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(({ palette }) => ({
  table: {
    width: '95%',
    height: 600,
    backgroundColor: palette.grey[400],
    transform: 'scale(1, 0.80)',
    marginLeft: '2.5%',
    marginTop: '-50px',
  },
}))

const SecuritySkeleton = () => {
  const classes = useStyles()

  return <Skeleton className={classes.table} />
}

export default SecuritySkeleton
