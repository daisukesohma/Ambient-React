import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Grid } from '@material-ui/core'
import clsx from 'clsx'
import Pagination from 'components/Pagination'
import { CircularProgress } from 'ambient_ui'

import { dataPointsFetchRequested } from '../../redux/dataInfraSlice'

import DataPointsContainer from './DataPointsContainer'
import Header from './Header'
import useStyles from './styles'

function DataPointsPanel() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const dataPointsPages = useSelector(state => state.dataInfra.dataPointsPages)
  const dataPointsPage = useSelector(state => state.dataInfra.dataPointsPage)
  const selectedCampaign = useSelector(
    state => state.dataInfra.selectedCampaign,
  )
  const dataPointsActiveFilter = useSelector(
    state => state.dataInfra.dataPointsActiveFilter,
  )
  const dataPointsLoading = useSelector(
    state => state.dataInfra.dataPointsLoading,
  )

  const refreshAndUpdateDataPoints = page => {
    dispatch(
      dataPointsFetchRequested({
        dataCampaignId: selectedCampaign.id,
        page,
        tsIdentifierStart: dataPointsActiveFilter.startTs,
        tsIdentifierEnd: dataPointsActiveFilter.endTs,
      }),
    )
  }

  return (
    <Grid container id='alert-feed-panel' className={classes.container}>
      <Grid
        className={clsx(classes.contentContainer, classes.headerContainer)}
        container
        item
        xs={12}
      >
        <Header />
      </Grid>
      <Grid
        className={clsx(classes.contentContainer, classes.mainContainer)}
        container
        item
        xs={12}
      >
        {dataPointsLoading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <DataPointsContainer />
            {dataPointsPages > 1 && (
              <Pagination
                pageCount={dataPointsPages}
                onPageChange={e => refreshAndUpdateDataPoints(e.selected + 1)}
                selectedPage={dataPointsPage}
              />
            )}
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default DataPointsPanel
