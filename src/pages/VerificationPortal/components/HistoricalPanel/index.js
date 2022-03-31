import React, { useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import MultiSelect from 'react-multi-select-component'
import get from 'lodash/get'
import map from 'lodash/map'
import find from 'lodash/find'
import _filter from 'lodash/filter'
import includes from 'lodash/includes'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Icon } from 'react-icons-kit'
import { useSelector, useDispatch } from 'react-redux'
import { refreshCcw } from 'react-icons-kit/feather/refreshCcw'
import { maximize } from 'react-icons-kit/feather/maximize'
import { minimize } from 'react-icons-kit/feather/minimize'
// src
import { DropdownMenu } from 'ambient_ui'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import Tooltip from 'components/Tooltip'
import Pagination from 'components/Pagination'
import SearchInput from 'components/atoms/SearchInput'

import {
  setHistoricalFilter,
  getAlertInstanceRequested,
  toggleHistoryPanel,
  toggleFullScreen,
  alertHistoryFetchRequested,
} from '../../redux/verificationSlice'
import streamsBySites from '../../selectors/streamsBySites'

import HistoricalAlertFeedContainer from './HistoricalAlertFeedContainer'
import { HISTORY_PANEL_STATUSES } from '../../constants'
import { useStyles } from './styles'

function HistoricalPanel() {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const sites = useSelector(state => state.verification.sites)
  const tobBarSelectedSites = useSelector(
    state => state.verification.selectedSites,
  )
  const filter = useSelector(state => state.verification.historicalFilter)
  const isExpanded = useSelector(state => state.verification.isExpanded)
  const darkMode = useSelector(state => state.settings.darkMode)
  const pageCount = useSelector(state => state.verification.pageCount)
  const currentPage = useSelector(state => state.verification.currentPage)
  const totalCount = useSelector(state => state.verification.totalCount)
  const fullScreen = useSelector(state => state.verification.fullScreen)
  const classes = useStyles({ darkMode, fullScreen })
  const streams = useSelector(streamsBySites)
  const threatSignatures = useSelector(
    state => state.verification.threatSignatures,
  )

  const streamOptions = map(streams, ({ stream }) => ({
    label: stream.name,
    value: stream.id,
  }))

  const threatSignatureOptions = map(threatSignatures, threatSignature => ({
    label: threatSignature.name,
    value: threatSignature.id,
  }))

  const siteOptions = map(sites, site => ({
    label: `${site.account.name} - ${site.name}`,
    value: site.id,
  }))

  const fetchAlerts = () => {
    dispatch(alertHistoryFetchRequested({ page: 1 }))
  }

  useEffect(() => {
    if (filter) fetchAlerts()
  }, [filter, dispatch])

  const toggleExpand = () => {
    dispatch(toggleHistoryPanel({ sites: tobBarSelectedSites }))
  }
  const toggleFullScreenHandler = () => dispatch(toggleFullScreen())

  const handleSelectFilter = field => result => {
    const value = get(result, 'value', null)
    dispatch(setHistoricalFilter({ [field]: value }))
  }

  const handleChangeTimeRange = value => {
    dispatch(setHistoricalFilter({ tsStart: value[0] }))
    dispatch(setHistoricalFilter({ tsEnd: value[1] }))
  }

  const handleClearSearch = () =>
    dispatch(setHistoricalFilter({ searchAlertId: '' }))

  const handleSearch = event => {
    if (event.key === 'Enter') {
      dispatch(
        getAlertInstanceRequested({ alertInstanceId: filter.searchAlertId }),
      )
    } else {
      dispatch(setHistoricalFilter({ searchAlertId: event.target.value }))
    }
  }

  const selectedSites = _filter(siteOptions, site =>
    includes(filter.sites, site.value),
  )
  const selectedStreams = _filter(streamOptions, stream =>
    includes(filter.streams, stream.value),
  )
  const selectedThreatSignatures = _filter(
    threatSignatureOptions,
    threatSignature => includes(filter.threatSignatures, threatSignature.value),
  )

  const selectedStatus = find(HISTORY_PANEL_STATUSES, { value: filter.status })

  const ChevronIcon = isExpanded ? ArrowRight : ArrowLeft

  return (
    <>
      <div
        className={clsx(classes.expandContainer, {
          [classes.expandedIcon]: isExpanded,
          [classes.notExpandedIcon]: !isExpanded,
        })}
        onClick={toggleExpand}
      >
        <ChevronIcon stroke={palette.common.white} fontSize={'large'} />
      </div>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='right'
        open={isExpanded}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container className={classes.root}>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: '100%',
                  transition: {
                    duration: 0.2,
                  },
                }}
                exit={{
                  width: 0,
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Grid className={classes.instancesContainer}>
                  <Grid item container justify='center' alignItems='center'>
                    <Box className={clsx('am-h4', classes.historyTitle)}>
                      History
                    </Box>
                    <Box className={classes.refreshIcon} onClick={fetchAlerts}>
                      <Tooltip
                        content='Reload Alerts'
                        theme='ambient-white'
                        arrow
                      >
                        <Icon icon={refreshCcw} size={16} />
                      </Tooltip>
                    </Box>
                    <Box
                      className={classes.refreshIcon}
                      onClick={toggleFullScreenHandler}
                    >
                      <Tooltip
                        content={fullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        theme='ambient-white'
                        arrow
                      >
                        <Icon
                          icon={fullScreen ? minimize : maximize}
                          size={16}
                        />
                      </Tooltip>
                    </Box>
                  </Grid>

                  <Grid item>
                    <Grid container justify='center' alignItems='center'>
                      <Grid item xs={4}>
                        <DateTimeRangePickerV3
                          onChange={handleChangeTimeRange}
                          startTs={filter.tsStart}
                          endTs={filter.tsEnd}
                          darkMode
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <MultiSelect
                          className={classes.multiSelect}
                          options={siteOptions}
                          value={selectedSites}
                          onChange={_sites => {
                            handleSelectFilter('sites')({
                              value: map(_sites, 'value'),
                            })
                          }}
                          labelledBy={'SiteSelector'}
                          overrideStrings={{
                            selectSomeItems: 'Select at least one site',
                            allItemsAreSelected: 'All sites selected',
                            selectAll: 'Select All Sites',
                            search: 'Search sites',
                            clearSearch: 'Clear Search',
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <DropdownMenu
                          styles={{ width: '100%' }}
                          menuItems={HISTORY_PANEL_STATUSES}
                          handleSelection={handleSelectFilter('status')}
                          selectedItem={selectedStatus}
                        />
                      </Grid>
                    </Grid>

                    <Accordion classes={{ root: classes.accordionRoot }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                      >
                        <Typography className={classes.heading}>
                          Advanced Filters
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container>
                          <Grid item xs={4}>
                            <SearchInput
                              value={filter.searchAlertId}
                              onClear={handleClearSearch}
                              darkMode={darkMode}
                              onChange={handleSearch}
                              onKeyPress={handleSearch}
                              InputProps={{
                                placeholder: 'Search Alert ID',
                              }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <MultiSelect
                              className={classes.multiSelect}
                              options={threatSignatureOptions}
                              value={selectedThreatSignatures}
                              onChange={_threatSignatures => {
                                handleSelectFilter('threatSignatures')({
                                  value: map(_threatSignatures, 'value'),
                                })
                              }}
                              labelledBy={'ThreatSignatureSelector'}
                              overrideStrings={{
                                selectSomeItems: 'Threat Signatures...',
                                allItemsAreSelected: 'All Threat Signatures',
                                selectAll: 'All Threat Signatures',
                                search: 'Search threat signature',
                                clearSearch: 'Clear Search',
                              }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <MultiSelect
                              className={classes.multiSelect}
                              options={streamOptions}
                              value={selectedStreams}
                              onChange={_streams => {
                                handleSelectFilter('streams')({
                                  value: map(_streams, 'value'),
                                })
                              }}
                              labelledBy={'StreamSelector'}
                              overrideStrings={{
                                selectSomeItems: 'Streams...',
                                allItemsAreSelected: 'All Streams',
                                selectAll: 'All Streams',
                                search: 'Search streams',
                                clearSearch: 'Clear Search',
                              }}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    <Grid item>
                      <HistoricalAlertFeedContainer />
                    </Grid>
                    <Grid item>
                      {totalCount > 0 && (
                        <Pagination
                          manual
                          pageCount={pageCount}
                          selectedPage={currentPage}
                          onPageChange={({ selected }) => {
                            dispatch(
                              alertHistoryFetchRequested({
                                page: selected + 1,
                              }),
                            )
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Drawer>
    </>
  )
}

export default HistoricalPanel
