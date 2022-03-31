import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Grid, Box, LinearProgress } from '@material-ui/core'
import { map } from 'lodash'
// src
import { ActivityTypeEnum } from 'enums'
import sortedByTime from 'selectors/activityLogs/sortedByTime'
import AlertEvent from 'components/AlertEvent'
import AccessAlarm from 'components/Cards/variants/AccessAlarm'
import SearchBar from 'components/molecules/SearchBar'
import PaginationAroundWrapper from 'components/Pagination/PaginationAroundWrapper'
import { setState } from 'pages/ActivityLog/activityLogSlice'

import useStyles from './styles'

export default function ActivityLogGrid() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { account } = useParams()
  const activityLogs = useSelector(sortedByTime)
  const loading = useSelector(state => state.activityLog.loading)
  const searchQuery = useSelector(state => state.activityLog.searchQuery)
  const darkMode = useSelector(state => state.settings.darkMode)
  const pages = useSelector(state => state.activityLog.pages)
  const page = useSelector(state => state.activityLog.page)

  const handlePage = event => {
    dispatch(setState({ page: event.selected }))
  }

  const handleSearchBarChange = event => {
    dispatch(setState({ filters: { searchQuery: event.currentTarget.value } }))
  }

  const handleSearchBarClear = () => {
    dispatch(setState({ filters: { searchQuery: '' } }))
  }

  return (
    <div className={classes.root}>
      <Grid lg={4} md={4} sm={12} xs={12}>
        <Box mb={1}>
          <SearchBar
            isClearShown
            onChange={handleSearchBarChange}
            onClear={handleSearchBarClear}
            value={searchQuery}
            darkMode={darkMode}
          />
        </Box>
      </Grid>

      {loading && (
        <Grid>
          <LinearProgress />
        </Grid>
      )}

      {!loading && (
        <PaginationAroundWrapper
          pageCount={pages}
          onPageChange={handlePage}
          selectedPage={page + 1}
        >
          <Grid container spacing={3} className={classes.wrapper}>
            {map(activityLogs, activity => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  key={activity.id}
                >
                  {activity.__typename === ActivityTypeEnum.AlertEventType ? (
                    <AlertEvent
                      id={activity.id}
                      alertEventData={activity}
                      accountSlug={account}
                      darkMode={darkMode}
                      showControls
                      showDetails
                      showBadge
                    />
                  ) : (
                    <AccessAlarm activity={activity} darkMode={darkMode} />
                  )}
                </Grid>
              )
            })}
          </Grid>
        </PaginationAroundWrapper>
      )}
    </div>
  )
}
