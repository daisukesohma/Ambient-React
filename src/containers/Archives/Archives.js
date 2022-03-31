import React, { useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Grid, Box, Typography } from '@material-ui/core'
import { DropdownMenu } from 'ambient_ui'
import moment from 'moment'
import get from 'lodash/get'
import find from 'lodash/find'
import {
  fetchSitesRequested,
  setStateValue,
  fetchStreamsRequested,
  fetchInstancesRequested,
  deleteClipRequested,
} from 'redux/slices/archives'
import { useSprings } from 'react-spring'
// src
import DateTimeRangePickerV3 from 'components/organisms/DateTimeRangePickerV3'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import { showModal } from 'redux/slices/modal'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

import { ModalTypeEnum } from '../../enums'
import PageTitle from '../../components/Page/Title'

import ArchivesSkeleton from './components/ArchivesSkeleton'
import useStyles from './styles'
import ArchiveCard from './components/ArchiveCard'
import SearchableSelectDropdown from 'ambient_ui/components/menus/SearchableSelectDropdown'
import PaginationAroundWrapper from '../../components/Pagination/PaginationAroundWrapper'
import LoadingScreen from '../LoadingScreen'

const PER_PAGE = 8

export default function Archives() {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const dispatch = useDispatch()
  const { account: accountSlug } = useParams()
  const deleteConfirmed = useSelector(state =>
    get(state, 'modal.data.confirmed'),
  )

  const handleOpenModal = data => {
    dispatch(showModal(data))
  }

  const {
    loading,
    loadingSites,
    loadingStreams,
    loadingInstances,
    startTs,
    endTs,
    page,
    siteOptions,
    instances,
    streams,
    pages,
    selectedStream: streamId,

    clipToDelete,
  } = useSelector(state => state.archives)
  const [globalSelectedSite, setGlobalSelectedSite] = useGlobalSelectedSite()
  const selectedSiteOption = find(siteOptions, { value: globalSelectedSite })
  const timezone = get(selectedSiteOption, 'timezone', DEFAULT_TIMEZONE)

  const siteSlug = get(selectedSiteOption, 'value', null)
  const siteName = get(selectedSiteOption, 'label', '')

  const animationProps = useSprings(
    instances.length,
    (instances || []).map(_ => ({
      from: {
        opacity: 0,
        transform: 'scale(0.3)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    })),
  )

  useEffect(() => {
    // load sites first
    dispatch(fetchSitesRequested({ accountSlug }))
  }, [accountSlug, dispatch])

  useEffect(() => {
    if (siteSlug) {
      dispatch(fetchStreamsRequested({ accountSlug, siteSlug }))
    }
  }, [accountSlug, siteSlug, dispatch])

  useEffect(() => {
    if (deleteConfirmed) {
      const filters = {
        startTs: startTs * 1000,
        endTs: endTs * 1000,
        page,
        limit: PER_PAGE,
      }
      if (streamId) {
        filters.streamIds = [streamId]
      }
      dispatch(
        deleteClipRequested({
          uniq: clipToDelete,
          ...filters,
          accountSlug,
          siteSlug,
        }),
      )
    }
    // eslint-disable-next-line
  }, [deleteConfirmed, clipToDelete, dispatch])

  const handlePageChange = ({ selected }) => {
    dispatch(
      setStateValue({
        key: 'page',
        value: selected + 1,
      }),
    )
  }

  const handleSiteSelect = option => {
    setGlobalSelectedSite(option.value)
  }

  const handleFilterChange = async () => {
    if (accountSlug && siteSlug) {
      const filters = {
        startTs: startTs * 1000,
        endTs: endTs * 1000,
        page,
        limit: PER_PAGE,
      }
      if (streamId) {
        filters.streamIds = [streamId]
      }
      dispatch(fetchInstancesRequested({ ...filters, accountSlug, siteSlug }))
    }
  }

  useEffect(() => {
    handleFilterChange()
    // eslint-disable-next-line
  }, [startTs, endTs, page, streamId, accountSlug, siteSlug])

  useEffect(() => {
    // reset page
    dispatch(setStateValue({ key: 'page', value: 1 }))
  }, [startTs, endTs, streamId, siteSlug, dispatch])

  const handleChangeTimeRange = e => {
    batch(() => {
      dispatch(
        setStateValue({
          key: 'startTs',
          value: e[0],
        }),
      )
      dispatch(
        setStateValue({
          key: 'endTs',
          value: e[1],
        }),
      )
    })
  }

  const handleStreamChange = ({ value }) => {
    dispatch(setStateValue({ key: 'selectedStream', value }))
  }

  const handleDelete = ({ uniq, stream, startTs: itemStart }) => () => {
    dispatch(setStateValue({ key: 'clipToDelete', value: uniq }))
    handleOpenModal({
      type: ModalTypeEnum.CONFIRM,
      content: {
        // eslint-disable-next-line react/display-name
        html: () => (
          <div className={classes.alertMsg}>
            Are you sure you want to{' '}
            <span className={classes.highlight}>delete</span> this archived
            footage from "{`${siteName} ${stream.name}`}" on{' '}
            {`${moment(itemStart).format('MMMM DD, YYYY')}`}
            ?
            <br />
            <br /> Once it is deleted, it is{' '}
            <span className={classes.highlight}>gone forever</span>.
          </div>
        ),
      },
    })
  }

  return loading || loadingStreams || loadingSites || loadingInstances ? (
    // <ArchivesSkeleton />
    <LoadingScreen />
  ) : (
    <Grid item xs={12} sm={12} lg={12} xl={12} md={12} className={classes.root}>
      <PageTitle title='Archives' darkMode={darkMode} />
      <Grid
        className={classes.header}
        item
        xs={12}
        sm={12}
        lg={12}
        xl={12}
        md={12}
      >
        <Grid className={classes.filterItem}>
          <Typography className={classes.label}>Site</Typography>
          <Grid>
            <SearchableSelectDropdown
              options={siteOptions}
              value={find(siteOptions, { value: siteSlug })}
              onChange={handleSiteSelect}
            />
          </Grid>
        </Grid>
        <Grid className={classes.filterItem}>
          <Typography className={classes.label}>Stream</Typography>
          <Grid className={classes.dropdown}>
            <DropdownMenu
              menuItems={streams}
              selectedItem={find(streams, { value: streamId })}
              handleSelection={handleStreamChange}
            />
          </Grid>
        </Grid>
        <Grid className={classes.filterItem}>
          <Typography className={classes.label}>Time</Typography>
          <DateTimeRangePickerV3
            onChange={handleChangeTimeRange}
            startTs={startTs}
            endTs={endTs}
            darkMode={darkMode}
            timezone={timezone}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {instances.length === 0 && (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='center'
              mt={4}
            >
              No archived clips found for selected streams and time range.
            </Box>
          </Grid>
        )}
        {instances.length > 0 && (
          <PaginationAroundWrapper
            pageCount={pages}
            selectedPage={page}
            onPageChange={handlePageChange}
          >
            {animationProps.map((styleProps, index) => {
              const item = instances[index]
              return (
                <ArchiveCard
                  styleProps={styleProps}
                  key={item.id}
                  item={item}
                  siteName={siteName}
                  handleDelete={handleDelete}
                />
              )
            })}
          </PaginationAroundWrapper>
        )}
      </Grid>
    </Grid>
  )
}
