import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
    flex: 1,
  },
  item: {
    width: '100%',
    height: 40,
    marginRight: 5,
    backgroundColor: palette.grey[400],
  },
}))

const SecurityProfileSelectorSkeleton = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Skeleton className={classes.item} />
    </div>
  )
}

export default SecurityProfileSelectorSkeleton
