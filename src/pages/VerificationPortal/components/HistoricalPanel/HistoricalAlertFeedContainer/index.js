import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import GridList from '@material-ui/core/GridList'
import LinearProgress from '@material-ui/core/LinearProgress'
import GridListTile from '@material-ui/core/GridListTile'
import { isWidthDown, isWidthUp } from '@material-ui/core/withWidth'
import map from 'lodash/map'
// src
import AlertInstanceCard from 'pages/VerificationPortal/components/AlertFeedPanel/AlertFeedContainer/AlertInstanceCard'
import useWidth from 'common/hooks/useWidth'

import useStyles from './styles'

const propTypes = {
  width: PropTypes.string,
}

function HistoricalAlertFeedContainer() {
  const classes = useStyles()

  const historyLoading = useSelector(state => state.verification.historyLoading)
  const historyInstances = useSelector(
    state => state.verification.historyInstances,
  )

  const [cols, setCols] = useState(3)
  const width = useWidth()

  useEffect(() => {
    if (isWidthUp('sm', width)) setCols(1)
    if (isWidthUp('md', width) && isWidthDown('lg', width)) setCols(2)
    if (isWidthUp('lg', width) && isWidthDown('xl', width)) setCols(3)
    if (isWidthUp('xl', width)) setCols(4)
  }, [width])

  return (
    <>
      {historyLoading && <LinearProgress />}
      <div className={classes.root}>
        <GridList classes={{ root: classes.gridRoot }} cols={cols}>
          {map(historyInstances, (alertInstance, i) => (
            <GridListTile key={i} className={classes.gridListTile}>
              <AlertInstanceCard
                cardSize='small'
                alertInstance={alertInstance}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    </>
  )
}

HistoricalAlertFeedContainer.propTypes = propTypes

export default HistoricalAlertFeedContainer
