import React from 'react'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import { useSelector } from 'react-redux'
import first from 'lodash/first'
import map from 'lodash/map'
// src

import orderedAlerts from '../../../selectors/orderedAlerts'

import AlertInstanceCard from './AlertInstanceCard'
import useStyles from './styles'

const AlertFeedContainer = () => {
  const classes = useStyles()
  const alerts = useSelector(orderedAlerts)
  const isExpanded = useSelector(state => state.verification.isExpanded)

  const firstAlert = first(alerts)
  const remainingAlerts = alerts.slice(1)

  return (
    <Grid container className={classes.contentWrapper}>
      <Grid
        xs={isExpanded ? 8 : 10}
        item
        container
        justify='center'
        alignContent='center'
        className={classes.alertContainer}
      >
        {firstAlert && (
          <AlertInstanceCard
            alertInstance={firstAlert}
            cardStyle={{
              width: isExpanded ? '100%' : '55%',
            }}
          />
        )}
      </Grid>

      <Grid
        xs={isExpanded ? 4 : 2}
        item
        container
        justify='center'
        alignItems='center'
      >
        <GridList className={classes.gridList} cellHeight={'auto'} cols={1}>
          {map(remainingAlerts, (alertInstance, i) => (
            <GridListTile
              cols={1}
              key={alertInstance.id}
              classes={{ root: classes.tileRoot, tile: classes.tileTile }}
            >
              <AlertInstanceCard
                alertInstance={alertInstance}
                cardSize='small'
              />
            </GridListTile>
          ))}
        </GridList>
      </Grid>
    </Grid>
  )
}

export default AlertFeedContainer
