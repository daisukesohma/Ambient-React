/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Box, Avatar, Grid, Modal, Paper } from '@material-ui/core'
import {
  map,
  some,
  pick,
  compact,
  keys,
  isNumber,
  concat,
  extend,
  isEmpty,
  get,
  first,
  last,
  filter,
  includes,
} from 'lodash'
import { Icon } from 'react-icons-kit'
import { filter as filterIcon } from 'react-icons-kit/feather/filter'
import { isMobile } from 'react-device-detect'
import {
  useQueryParams,
  withDefault,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params'
// src
import { Icons, Button, SearchableSelectDropdown } from 'ambient_ui'
import { setActivityLogViewMode } from 'redux/slices/settings'
import {
  resetFilters,
  activityLogsFetchRequested,
  fetchDownloadLinkRequested,
  getStreamsRequested,
  getSecurityProfilesRequested,
  setState,
  setActiveFilter,
  ACTIVITIES_SUB_FILTERS_MAP,
  fetchDownloadReset,
  fetchAccessAlarmTypesRequested,
  fetchThreatSignaturesRequested,
} from 'pages/ActivityLog/activityLogSlice'
import {
  ActivityTypeToReadableEnum,
  LayoutEnum,
  ActivityTypeColor,
} from 'enums'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import PageTitle from 'components/Page/Title'
import clsx from 'clsx'
import { useCursorStyles } from 'common/styles/commonStyles'
import Tooltip from 'components/Tooltip'

import ActivityLogTable from './ActivityLogTable'
import ActivityLogGrid from './ActivityLogGrid'
import FilterForm from './FilterForm'
import useStyles from './styles'

import { ACTIVITIES_FILTERS_NAMES_MAP } from './constants'
import { sharedFilters } from './activityLogSlice'

const { Grid: GridIcon, List: ListIcon } = Icons

export default function ActivityLog() {
  const [query, setQuery] = useQueryParams({
    startTs: NumberParam,
    endTs: NumberParam,
    page: withDefault(NumberParam, 0),
    siteSlugs: withDefault(ArrayParam, []),
    searchQuery: withDefault(StringParam, ''),
  })
  const { palette } = useTheme()
  const { account } = useParams()
  const dispatch = useDispatch()

  const [allowInitialQuerySet, setAllowInitialQuerySet] = useState(false)

  const darkMode = useSelector(state => state.settings.darkMode)
  const viewMode = useSelector(state => state.settings.activityLogLayout)

  const sites = useSelector(state => state.auth.sites)
  const filters = useSelector(state => state.activityLog.filters)
  const activeFilter = useSelector(state => state.activityLog.activeFilter)

  const siteSlugs = useSelector(state => state.activityLog.siteSlugs)
  const startTs = useSelector(state => state.activityLog.startTs)
  const endTs = useSelector(state => state.activityLog.endTs)
  const page = useSelector(state => state.activityLog.page)
  const searchQuery = useSelector(state => state.activityLog.searchQuery)

  const loadingDownload = useSelector(
    state => state.activityLog.loadingDownload,
  )
  const downloadLink = useSelector(state => state.activityLog.downloadLink)
  const totalCount = useSelector(state => state.activityLog.totalCount)

  const classes = useStyles({ darkMode, isMobile })
  const cursorClasses = useCursorStyles()

  const siteOptions = map(sites, ({ id, name, slug, timezone }) => ({
    value: id,
    label: name,
    slug,
    timezone,
  }))

  const selectedSites = filter(siteOptions, site =>
    includes(siteSlugs, site.slug),
  )

  const timezone =
    selectedSites && selectedSites.length === 1
      ? selectedSites[0].timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone

  const setViewMode = mode =>
    dispatch(setActivityLogViewMode({ viewMode: mode }))

  const getActivityLogs = useCallback(
    ({ limit }) => {
      dispatch(activityLogsFetchRequested({ accountSlug: account, limit }))
    },
    [dispatch, account],
  )

  useEffect(() => {
    dispatch(fetchAccessAlarmTypesRequested())
  }, [dispatch])

  useEffect(() => {
    if (downloadLink) {
      window.open(downloadLink, '_blank')
      dispatch(fetchDownloadReset())
    }
  }, [downloadLink, dispatch])

  const isGridView = viewMode === LayoutEnum.GRID

  useEffect(() => {
    getActivityLogs({ limit: isGridView ? 20 : 25 })
  }, [filters, page])

  useEffect(() => {
    dispatch(fetchThreatSignaturesRequested({ accountSlug: account }))
  }, [dispatch, account])

  useEffect(() => {
    const resourcesParams = {
      accountSlug: account,
      siteSlugs,
      appointment: 'main',
    }
    dispatch(getStreamsRequested(resourcesParams))
    dispatch(getSecurityProfilesRequested(resourcesParams))
  }, [siteSlugs])

  const handleSiteChanges = selected => {
    const siteSlugs = map(selected, 'slug')
    const resourcesParams = {
      accountSlug: account,
      siteSlugs,
      appointment: 'main',
    }
    batch(() => {
      dispatch(setState({ filters: { selectedSites: selected, siteSlugs } }))
      dispatch(getStreamsRequested(resourcesParams))
      dispatch(getSecurityProfilesRequested(resourcesParams))
    })
  }

  // NOTE: avatar prop should receive `undefined` if empty according Material UI docs
  const getActiveSubFilterAvatar = filter => {
    if (!filter.active) return undefined
    const paramFilters = pick(filter, ACTIVITIES_SUB_FILTERS_MAP[filter.type])
    const activeParam = some(paramFilters, value => {
      return !isEmpty(value) || typeof value === 'boolean'
    })
    if (activeParam || filter.activeCommon) {
      return (
        <Avatar>
          <Icon icon={filterIcon} size={14} />
        </Avatar>
      )
    }
    return undefined
  }

  const tooltipContent = filter => {
    const baseText = filter.active ? 'Enabled Selection' : 'Disabled Selection'
    const paramFilters = pick(filter, ACTIVITIES_SUB_FILTERS_MAP[filter.type])
    if (filter.activeCommon)
      extend(paramFilters, pick(filter, keys(sharedFilters)))
    const filterTexts = compact(
      map(paramFilters, (value, key) => {
        if (typeof value === 'boolean')
          return ACTIVITIES_FILTERS_NAMES_MAP[key][value]
        return !isEmpty(value) || isNumber(value)
          ? ACTIVITIES_FILTERS_NAMES_MAP[key]
          : null
      }),
    )
    return !filter.active || isEmpty(filterTexts)
      ? baseText
      : concat(baseText, '. Active filters: ', filterTexts.join(', '))
  }

  useEffect(() => {
    if (allowInitialQuerySet)
      setQuery({ siteSlugs, searchQuery, page, startTs, endTs })
  }, [siteSlugs, startTs, endTs, page, searchQuery])

  useEffect(() => {
    dispatch(
      setState({
        filters: {
          siteSlugs: get(query, 'siteSlugs', siteSlugs),
          searchQuery: get(query, 'searchQuery', searchQuery),
          startTs: get(query, 'startTs', startTs),
          endTs: get(query, 'endTs', endTs),
        },
        page: get(query, 'page', page),
      }),
    )
    setAllowInitialQuerySet(true)
  }, [])

  return (
    <div>
      <Box display='flex' justifyContent='space-between' flexWrap='wrap'>
        <PageTitle title='Activities' darkMode={darkMode} />
        <div className={classes.switchRoot}>
          <div
            className={classes.viewSwitcher}
            style={{
              backgroundColor: isGridView
                ? darkMode
                  ? palette.common.black
                  : palette.common.white
                : darkMode
                ? palette.common.white
                : palette.common.black,
              border: isGridView
                ? `1px solid ${
                    darkMode ? palette.primary.main : palette.grey[300]
                  }`
                : 'none',
            }}
            onClick={() => setViewMode(LayoutEnum.LIST)}
          >
            <ListIcon
              stroke={
                isGridView
                  ? palette.primary.main
                  : darkMode
                  ? palette.common.black
                  : palette.common.white
              }
              width={24}
              height={24}
            />
          </div>
          <div
            className={classes.viewSwitcher}
            style={{
              backgroundColor: isGridView
                ? darkMode
                  ? palette.common.white
                  : palette.common.black
                : darkMode
                ? palette.common.black
                : palette.common.white,
              border: isGridView
                ? 'none'
                : `1px solid ${
                    darkMode ? palette.primary.main : palette.grey[300]
                  }`,
            }}
            onClick={() => setViewMode(LayoutEnum.GRID)}
          >
            <GridIcon
              stroke={
                isGridView
                  ? darkMode
                    ? palette.common.black
                    : palette.common.white
                  : palette.primary.main
              }
              width={24}
              height={24}
            />
          </div>
        </div>
      </Box>

      <Grid container alignItems='center' className={classes.filterContainer}>
        <Grid item>
          <span className={classes.filterLabel}> Filters: </span>
        </Grid>
        <Grid item>
          <DateTimeRangePickerV3
            rootStyles={{ marginRight: isMobile ? 0 : 16 }}
            onChange={times =>
              dispatch(
                setState({
                  filters: { startTs: first(times), endTs: last(times) },
                }),
              )
            }
            startTs={startTs}
            endTs={endTs}
            darkMode={darkMode}
            timezone={timezone}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} className={classes.filterContainer}>
          <SearchableSelectDropdown
            placeholder='Filter by sites'
            options={siteOptions}
            onChange={handleSiteChanges}
            value={selectedSites}
            isMulti
          />
        </Grid>
        <Grid item>
          <Box ml={2}>
            <Button
              onClick={() =>
                dispatch(
                  fetchDownloadLinkRequested({
                    accountSlug: account,
                  }),
                )
              }
              disabled={loadingDownload}
              loading={loadingDownload}
            >
              Download
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container alignItems='center' className={classes.filterContainer}>
        <span className={classes.filterLabel}> Activity selections: </span>

        {map(filters, (filter, index) => (
          <Box key={index} ml={0.5} mr={0.5}>
            <Tooltip content={tooltipContent(filter)}>
              <Button
                height={30}
                color='default'
                avatar={getActiveSubFilterAvatar(filter)}
                style={
                  filter.active
                    ? { backgroundColor: ActivityTypeColor[filter.type] }
                    : {}
                }
                onClick={() =>
                  dispatch(setActiveFilter({ activeFilter: filter }))
                }
              >
                {ActivityTypeToReadableEnum[filter.type]}
              </Button>
            </Tooltip>
          </Box>
        ))}
        <span
          className={clsx(
            classes.chipRoot,
            'am-overline',
            cursorClasses.clickableText,
            cursorClasses.pointer,
            classes.resetText,
          )}
          style={{ verticalAlign: 'text-top' }}
          onClick={() => dispatch(resetFilters())}
        >
          Disable Selections
        </span>
      </Grid>

      <Modal
        open={!isEmpty(activeFilter)}
        onClose={() => dispatch(setActiveFilter({ activeFilter: {} }))}
      >
        <Paper className={classes.modal}>
          <Box display='flex' flexDirection='column'>
            <FilterForm
              accountSlug={account}
              onCancel={() => dispatch(setActiveFilter({ activeFilter: {} }))}
            />
          </Box>
        </Paper>
      </Modal>

      {isGridView ? (
        <ActivityLogGrid
          getActivityLogs={getActivityLogs}
          totalCount={totalCount}
        />
      ) : (
        <ActivityLogTable
          getActivityLogs={getActivityLogs}
          totalCount={totalCount}
        />
      )}
    </div>
  )
}
