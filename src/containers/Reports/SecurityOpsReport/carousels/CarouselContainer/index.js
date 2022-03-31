import React from 'react'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import map from 'lodash/map'

import useStyles from './styles'

function CarouselContainer({ items, noDataMsg }) {
  const classes = useStyles()
  // FUTURE: instead of  width: 'calc(100vw - 272px)'}} maybe use react-sizeme
  // FUTURE: rethink hardcoded width in classes.gridListTile
  //
  if (items && items.length === 0) {
    return <div className={classes.rootEmpty}>{noDataMsg}</div>
  }
  return (
    <GridList
      className={classes.gridList}
      cols={4}
      style={{
        marginTop: 20,
        height: 'fit-content',
        width: 'calc(100vw - 272px)',
      }}
    >
      {map(items, (item, i) => (
        <GridListTile
          key={`alert-carousel-grid-${i}`}
          className={classes.gridListTile}
        >
          {item}
        </GridListTile>
      ))}
    </GridList>
  )
}

export default CarouselContainer
