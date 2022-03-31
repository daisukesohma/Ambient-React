import React from 'react'
import { Grid } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

import useStyles from './styles'

const ArchivesSkeleton = () => {
  const classes = useStyles()

  const renderItems = () => {
    const items = []
    for (let i = 0; i < 12; i++) {
      items.push(
        <Grid item lg={3} md={3} sm={12} xs={12} key={i}>
          <Skeleton className={classes.item} />
        </Grid>,
      )
    }
    return items
  }

  return (
    <Grid container>
      <Grid
        className={classes.header}
        item
        xs={12}
        sm={12}
        lg={12}
        xl={12}
        md={12}
      >
        <Skeleton className={classes.filter} />
      </Grid>
      <Grid container spacing={2}>
        {renderItems()}
      </Grid>
    </Grid>
  )
}

export default ArchivesSkeleton
