import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(({ palette }) => ({
  item: {
    width: '100%',
    height: 200,
    backgroundColor: palette.grey[400],
  },
}))

export default function AlertsSkeleton() {
  const classes = useStyles()

  const renderItems = () => {
    const items = []
    for (let i = 0; i < 12; i++) {
      items.push(
        <Grid item xl={3} lg={3} md={3} sm={12} xs={12} key={i}>
          <Skeleton className={classes.item} />
        </Grid>,
      )
    }
    return items
  }

  return (
    <Grid container>
      <Grid container spacing={2}>
        {renderItems()}
      </Grid>
    </Grid>
  )
}
