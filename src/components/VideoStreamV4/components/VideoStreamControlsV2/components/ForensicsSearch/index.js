import React, { useEffect, useState, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme, withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { useSelector, useDispatch, batch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { Icon } from 'react-icons-kit'
import { chevronRight } from 'react-icons-kit/feather/chevronRight'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import clsx from 'clsx'
// src
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import {
  fetchForensicsSuggestionsRequested,
  setVideoStreamValues,
  setCurrentResultsPage,
  resetSearch,
} from 'redux/slices/videoStreamControls'
import ExpandableSidebar from 'components/ExpandableSidebar'
import { StreamStateEnum } from 'enums'
import getWebRTCState from 'selectors/webrtc/getWebRTCState'
import { Icons } from 'ambient_ui'
import ReIdButton from 'components/ReId/components/ReIdButton'
import ReIdSelector from 'components/ReId/components/ReIdSelector'
import { useFlexStyles } from 'common/styles/commonStyles'
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import Pagination from 'components/Pagination'
import ForensicsLoadingResultCount from 'components/ForensicsLoadingResultCount'

import useForensicsResults from '../../../../hooks/useForensicsResults'
import useGotoPlaybackTime from '../../../../hooks/useGotoPlaybackTime'
import useTriggerResize from '../../../../../../common/hooks/useTriggerResize'

import VmsForensicsCardContainer from './components/VmsForensicsCardContainer'
import VmsForensicsSearchBar from './components/VmsForensicsSearchBar'
import useStyles from './styles'
import trackEventToMixpanel from '../../../../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../../../../enums'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  videoStreamKey: PropTypes.string,
  timezone: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
}

const { Clock } = Icons

const CustomCheckbox = withStyles(({ palette }) => ({
  root: {
    color: palette.grey[500],
    '&$checked': {
      color: palette.primary[500],
    },
  },
  checked: {},
}))(props => <Checkbox color='default' {...props} />)

function ForensicsSearch({
  accountSlug,
  videoStreamKey,
  timezone,
  siteSlug,
  streamId,
}) {
  const { palette } = useTheme()
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const triggerResize = useTriggerResize()
  const gotoPlaybackTime = useGotoPlaybackTime({ videoStreamKey })
  const getForensicsResults = useForensicsResults({
    videoStreamKey,
    accountSlug,
    siteSlug,
    streamId,
  })
  const searchQuery = useSelector(
    state => state.videoStreamControls.searchQuery,
  )

  const isReIdSearchOpen = useSelector(state => state.reId.isOpen)

  const streamMode = useSelector(
    getWebRTCState({
      videoStreamKey,
      property: 'mode',
      defaultValue: null,
    }),
  )

  useEffect(() => {
    if (accountSlug) {
      dispatch(fetchForensicsSuggestionsRequested({ accountSlug }))
    }
  }, [dispatch, accountSlug])

  const loadingSearch = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'loadingSearch',
    }),
  )

  const searchPages = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'searchPages',
    }),
  )

  const searchCurrentPage = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'searchCurrentPage',
    }),
  )

  const searchTotalCount = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'searchTotalCount',
    }),
  )

  const results = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'results',
    }),
  )

  const showForensicsPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showForensicsPanel',
    }),
  )

  const timelineRange = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeRange',
    }),
  )

  const toggleSidebar = useCallback(
    newState => {
      batch(() => {
        dispatch(
          setVideoStreamValues({
            videoStreamKey,
            props: {
              showForensicsPanel: newState,
              showAlertPanel: false,
            },
          }),
        )
        if (!newState) dispatch(resetSearch({ videoStreamKey }))
      })
      triggerResize()
    },
    [dispatch, videoStreamKey, triggerResize],
  )

  const [queryTsRange, setQueryTsRange] = useState(() => [
    moment(new Date())
      .subtract(1, 'days')
      .unix(),
    moment(new Date()).unix(),
  ])
  const [useTimelineRange, setUseTimelineRange] = useState(false) // use timeline range or custom selection range

  useEffect(() => {
    if (useTimelineRange && timelineRange) {
      if (moment(timelineRange[1]).isAfter(moment())) {
        // if end of range is after now, use now as the end
        setQueryTsRange([moment(timelineRange[0]).unix(), moment().unix()])
      } else {
        setQueryTsRange([
          moment(timelineRange[0]).unix(),
          moment(timelineRange[1]).unix(),
        ])
      }
    }
  }, [useTimelineRange, timelineRange])

  // re-query forensics results
  useEffect(() => {
    if (searchQuery.searchType) {
      trackEventToMixpanel(MixPanelEventEnum.VMS_ENTITY_SEARCH)
      getForensicsResults({
        startTs: Math.floor(queryTsRange[0]),
        endTs: Math.floor(queryTsRange[1]),
        query: searchQuery,
        page: searchCurrentPage,
      })
    }
  }, [searchQuery, queryTsRange, searchCurrentPage]) // eslint-disable-line

  const onPageChange = useCallback(
    e => {
      dispatch(
        setCurrentResultsPage({
          videoStreamKey,
          searchCurrentPage: e.selected + 1,
        }),
      )
    },
    [dispatch, videoStreamKey],
  )

  const [showTimeFilter, setShowTimeFilter] = useState(false)

  return (
    <ExpandableSidebar
      isOpen={showForensicsPanel}
      toggleSidebar={toggleSidebar}
    >
      <div
        onClick={() => toggleSidebar(false)}
        onKeyDown={() => toggleSidebar(false)}
        style={{ color: 'white' }}
      >
        <IconButton
          color='primary'
          size='small'
          classes={{ root: classes.iconButtonRoot }}
        >
          <Icon icon={chevronRight} size={18} />
        </IconButton>
      </div>
      <div className={classes.expandedContainer}>
        <Grid container justify='space-between' className={classes.searchPanel}>
          <Grid item lg={10} md={10} sm={10} xs={10}>
            <VmsForensicsSearchBar videoStreamKey={videoStreamKey} />
          </Grid>
          <Grid
            item
            lg={2}
            md={2}
            sm={2}
            xs={2}
            className={clsx(
              flexClasses.row,
              flexClasses.centerAll,
              classes.reIdIcon,
            )}
          >
            <ReIdButton
              color={palette.grey[700]}
              videoStreamKey={videoStreamKey}
              size={24}
            />
            <IconButton
              onClick={() => setShowTimeFilter(!showTimeFilter)}
              size='small'
            >
              <Clock stroke={palette.grey[500]} />
            </IconButton>
          </Grid>
        </Grid>
        {showTimeFilter && (
          <div style={{ marginTop: 16 }}>
            <DateTimeRangePickerV3
              onChange={range => {
                setUseTimelineRange(false)
                setQueryTsRange(range)
              }}
              startTs={queryTsRange[0]}
              endTs={queryTsRange[1]}
              darkMode
              timezone={timezone}
            />
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={useTimelineRange}
                  onChange={() => setUseTimelineRange(!useTimelineRange)}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  color='primary'
                  size='small'
                />
              }
              label={
                <span
                  className='am-overline'
                  style={{ color: palette.grey[500] }}
                >
                  Use Timeline Range
                </span>
              }
            />
          </div>
        )}
        {streamMode !== StreamStateEnum.LOADING && isReIdSearchOpen && (
          <div>
            <ReIdSelector account={accountSlug} />
          </div>
        )}

        {!isReIdSearchOpen && (
          <>
            <div
              className={clsx(
                flexClasses.row,
                flexClasses.centerBetween,
                classes.searchResultsPanel,
              )}
            >
              <div className={clsx('am-h5')}>Search Results</div>
              <ForensicsLoadingResultCount
                count={searchTotalCount}
                loading={loadingSearch}
              />
            </div>
            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr)', // '1fr 1fr', //
                gap: 8,
                gridGap: 8,
              }}
            >
              {results &&
                results.map(r => (
                  <VmsForensicsCardContainer
                    data={r}
                    key={`result-${r.stream.id}-${r.ts}`}
                    videoStreamKey={videoStreamKey}
                    gotoPlaybackTime={gotoPlaybackTime}
                  />
                ))}
            </div>
            <>
              {searchPages > 1 && (
                <div className={classes.paginationContainer}>
                  <Pagination
                    pageCount={searchPages}
                    selectedPage={searchCurrentPage}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          </>
        )}
      </div>
    </ExpandableSidebar>
  )
}

ForensicsSearch.propTypes = propTypes

export default memo(ForensicsSearch)
