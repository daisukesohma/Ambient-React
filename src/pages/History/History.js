/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch, batch } from 'react-redux'
import { isMobile, isBrowser } from 'react-device-detect'
import { Box, Tabs, Tab, Grid, Switch } from '@material-ui/core'
import { get, has, find, isEmpty } from 'lodash'
import clsx from 'clsx'
import { Can } from 'rbac'
import { useQueryParams, NumberParam, StringParam } from 'use-query-params'
// src
import { SearchableSelectDropdown, Button } from 'ambient_ui'
import InfoBox from 'components/atoms/InfoBox'
import { InfoBoxTypeEnum } from 'enums/InfoBoxContentEnum'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'

import {
  fetchSitesRequested,
  fetchDownloadLinkRequested,
  setStateValues,
  fetchAlertEventsRequested,
  fetchThreatSignaturesRequested,
  fetchStreamsRequested,
  resolveAlertRequested,
} from 'pages/History/alertHistorySlice'

import AlertEventsFeed from './AlertEventsFeed'
import {
  tabToType,
  SPOTLIGHT,
  ACTIVITY_LOG,
  MOBILE_SELECT_OPTIONS,
} from './constants'
import { produceFilter } from './utils'
import useStyles from './styles'

import 'react-tabs/style/react-tabs.css'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'
import MuiMultiSelect from 'components/molecules/MuiMultiSelect'

export default function AlertsHistory() {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()
  const { account } = useParams()

  const [allowInitialQuerySet, setAllowInitialQuerySet] = useState(false)

  const {
    dateRange,
    siteOptions,
    selectedThreatSignaturesFilter,
    selectedStreamsFilter,
    streamOptions,
    threatSignatures,
    page,
    pages,
    isTestFilter,
    newAlertsNum,
    tabIndex,
    alertEvents,
    currentPage,
    loading,
    loadingSites,
    loadingAlertEvents,
    loadingThreatSignatures,
    loadingStreams,
    loadingDownload,
    downloadLink,
  } = useSelector(state => state.alertHistory)

  const tabType = tabToType[tabIndex]

  const [query, setQuery] = useQueryParams({
    startTs: NumberParam,
    endTs: NumberParam,
    tab: NumberParam,
    host: StringParam,
    page: NumberParam,
  })

  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite(
    true,
  )
  const selectedSiteOption = find(siteOptions, {
    value: get(query, 'host', globalSelectedSite),
  })

  const isLoading =
    loading ||
    loadingSites ||
    loadingAlertEvents ||
    loadingThreatSignatures ||
    loadingStreams

  const onChangeDatePicker = newDateRange => {
    dispatch(setStateValues({ dateRange: newDateRange }))
  }

  const handleTabSelect = tabIndex => {
    dispatch(
      setStateValues({
        tabIndex,
        alertEvents: [],
        currentPage: 0,
        page: 1,
        newAlertsNum: 0,
      }),
    )
  }

  const fetchArgs = {
    accountSlug: account,
    startTs: dateRange[0],
    endTs: dateRange[1],
    page,
    isTest: isTestFilter,
    severities: ['sev0', 'sev1'],
    // This number must be a multiple of the LCM of (1,2,3,4) as the UI
    // displays this in a grid of lg={3}, which means maximum 4 in a row.
    // The multiple of the LCM allows us to have fully utilized rows.
    limit: 24,
    siteSlugs: isEmpty(get(selectedSiteOption, 'value'))
      ? null
      : [get(selectedSiteOption, 'value')],
    threatSignatureIds:
      selectedThreatSignaturesFilter && selectedStreamsFilter.length > 0
        ? selectedThreatSignaturesFilter
        : null,
    streamIds:
      selectedStreamsFilter && selectedStreamsFilter.length > 0
        ? selectedStreamsFilter
        : null,
    bookmarked: tabType === SPOTLIGHT ? true : null,
    status: tabType === SPOTLIGHT ? null : tabType,
  }

  useEffect(() => {
    dispatch(fetchAlertEventsRequested({ variables: fetchArgs }))
  }, [
    dispatch,
    account,
    page,
    dateRange,
    isTestFilter,
    tabIndex,
    selectedThreatSignaturesFilter,
    selectedStreamsFilter,
    globalSelectedSite,
  ])

  useEffect(() => {
    dispatch(fetchSitesRequested({ accountSlug: account }))
  }, [])

  const fetchThreatSignaturesAndStreams = ({ accountSlug, siteSlug }) => {
    batch(() => {
      dispatch(fetchThreatSignaturesRequested({ accountSlug, siteSlug }))
      dispatch(fetchStreamsRequested({ accountSlug, siteSlug }))
    })
  }

  useEffect(() => {
    if (has(selectedSiteOption, 'value')) {
      fetchThreatSignaturesAndStreams({
        accountSlug: account,
        siteSlug: selectedSiteOption.value,
      })
    }
  }, [account, selectedSiteOption])

  useEffect(() => {
    if (downloadLink) {
      window.open(downloadLink, '_blank')
    }
  }, [downloadLink])

  const changePage = page => {
    dispatch(setStateValues({ page }))
  }

  const handleChangeSite = selection => {
    if (selection.value) {
      setGlobalSelectedSite(selection.value)
      fetchThreatSignaturesAndStreams({
        accountSlug: account,
        siteSlug: selection.value,
      })
    } else {
      setGlobalSelectedSite(selection.value)
      dispatch(
        setStateValues({
          selectedThreatSignaturesFilter: [],
          selectedStreamsFilter: [],
        }),
      )
    }
    setQuery({ host: selection.value })
  }

  const handleChangeStreamOptions = selection => {
    const newSelectedStreamsFilter = produceFilter(selection)
    dispatch(
      setStateValues({
        selectedStreams: selection,
        selectedStreamsFilter: newSelectedStreamsFilter,
      }),
    )
  }

  const handleChangeThreatSignatures = selection => {
    const newSelectedThreatSignaturesFilter = produceFilter(selection)
    console.log(newSelectedThreatSignaturesFilter)
    dispatch(
      setStateValues({
        selectedThreatSignaturesFilter: newSelectedThreatSignaturesFilter,
      }),
    )
  }

  const resolveAlert = alertEvent => {
    dispatch(resolveAlertRequested({ alertEvent }))
  }

  const displayNewIndicator =
    newAlertsNum > 0 ? (
      <span
        className={clsx(
          'pull-right sk-spinner sk-spinner-pulse security-profile-live',
          classes.newIndicator,
        )}
      />
    ) : null

  const startTs = dateRange[0]
  const endTs = dateRange[1]
  const timezone = get(selectedSiteOption, 'timezone')

  useEffect(() => {
    if (allowInitialQuerySet)
      setQuery({
        tab: tabIndex,
        startTs: dateRange[0],
        endTs: dateRange[1],
        host: get(query, 'host', globalSelectedSite),
        page,
      })
  }, [tabIndex, dateRange, page])

  useEffect(() => {
    dispatch(
      setStateValues({
        dateRange: [
          get(query, 'startTs', dateRange[0]),
          get(query, 'endTs', dateRange[1]),
        ],
        tabIndex: get(query, 'tab', tabIndex),
        siteSlugs: isEmpty(get(selectedSiteOption, 'value'))
          ? null
          : [get(selectedSiteOption, 'value')],
        page: get(query, 'page', page),
      }),
    )
    setAllowInitialQuerySet(true)
  }, [])

  return (
    <div className={classes.root}>
      <div className='am-h4' style={{ textAlign: 'left', marginBottom: 24 }}>
        Alerts
      </div>
      <Box
        display='flex'
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems='center'
        flexWrap='wrap'
        className={classes.filterRoot}
      >
        {tabType !== ACTIVITY_LOG && (
          <Box width={1} maxWidth={isBrowser ? '200px' : 'unset'} pr={1} pb={1}>
            <SearchableSelectDropdown
              placeholder='Select Site'
              options={siteOptions}
              onChange={handleChangeSite}
              value={selectedSiteOption}
            />
          </Box>
        )}
        <Box pb={1} style={!isBrowser ? { width: '100%' } : {}}>
          <DateTimeRangePickerV3
            onChange={onChangeDatePicker}
            startTs={startTs}
            endTs={endTs}
            darkMode={darkMode}
            timezone={timezone}
          />
        </Box>
        <Can I='is_internal' on='Admin'>
          <Box ml={0.5} mr={1.0}>
            <Button
              variant='outlined'
              onClick={() => {
                dispatch(fetchDownloadLinkRequested(fetchArgs))
              }}
              loading={loadingDownload}
              disabled={loadingDownload}
            >
              Export CSV
            </Button>
          </Box>
          <Box display='flex' flexDirection='row' alignItems='center' pb={1.5}>
            <Box>
              <div>Test Only</div>
            </Box>
            <Box>
              <Switch
                onChange={() =>
                  dispatch(setStateValues({ isTestFilter: !isTestFilter }))
                }
                checked={isTestFilter}
                color='primary'
              />
            </Box>
          </Box>
        </Can>
      </Box>
      <InfoBox type={InfoBoxTypeEnum.TIMEZONE_SUPPORT} />
      <Grid container>
        {tabType !== ACTIVITY_LOG && globalSelectedSite && (
          <>
            <Box mt={3} mr={2}>
              <MuiMultiSelect
                hasSelectAll
                label='Alert Types'
                noOptionsText='No Types'
                options={threatSignatures}
                onClose={handleChangeThreatSignatures}
                onClear={handleChangeThreatSignatures}
              />
            </Box>
            <Box mt={3}>
              <MuiMultiSelect
                hasSelectAll
                label='Streams'
                noOptionsText='No Streams'
                options={streamOptions}
                onClose={handleChangeStreamOptions}
                onClear={handleChangeStreamOptions}
              />
            </Box>
          </>
        )}
      </Grid>
      {isMobile && (
        <div className={classes.mobileTabs}>
          <SearchableSelectDropdown
            options={MOBILE_SELECT_OPTIONS}
            onChange={({ value }) => handleTabSelect(value)}
            value={find(MOBILE_SELECT_OPTIONS, { value: tabIndex })}
          />
        </div>
      )}
      <Grid container>
        <Grid item lg={7} md={10} sm={12} xs={12}>
          <Tabs
            value={tabIndex}
            indicatorColor='primary'
            variant='fullWidth'
            textColor='secondary'
            onChange={(event, index) => handleTabSelect(index)}
            classes={{
              root: classes.tabContainer,
            }}
          >
            <Tab
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
              }}
              label={'Spotlight'}
            />
            <Tab
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
              }}
              label={'Dispatched'}
            />
            <Tab
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
              }}
              label={'Resolved'}
            />
            <Tab
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
              }}
              label={
                displayNewIndicator
                  ? `${displayNewIndicator} Outstanding`
                  : 'Outstanding'
              }
            />
          </Tabs>
        </Grid>
      </Grid>
      {tabIndex === 0 || tabIndex === 3 ? (
        <AlertEventsFeed
          id={tabIndex + 1}
          accountSlug={account}
          resolveAlert={resolveAlert}
          alertEvents={alertEvents}
          alertIds={selectedThreatSignaturesFilter}
          changePage={changePage}
          currentPage={currentPage}
          endTs={endTs}
          isGridView
          loading={isLoading}
          page={page}
          pages={pages}
          pagination
          showCaseManagement={false}
          siteSlug={globalSelectedSite}
          startTs={startTs}
          streamIds={selectedStreamsFilter}
        />
      ) : (
        <AlertEventsFeed
          id={tabIndex + 1}
          accountSlug={account}
          alertEvents={alertEvents}
          alertIds={selectedThreatSignaturesFilter}
          changePage={changePage}
          currentPage={currentPage}
          endTs={endTs}
          isGridView
          loading={isLoading}
          page={page}
          pages={pages}
          pagination
          showCaseManagement={false}
          siteSlug={globalSelectedSite}
          startTs={startTs}
          streamIds={selectedStreamsFilter}
        />
      )}
    </div>
  )
}
