import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Modal, Box } from '@material-ui/core'
import NoMeetingRoomOutlinedIcon from '@material-ui/icons/NoMeetingRoomOutlined'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import { isArray, isEmpty, some, get, truncate, map, times } from 'lodash'
// src
import { Icon } from 'ambient_ui'
import Tooltip from 'components/Tooltip'
import BaseModalWrapper from 'components/Modals/Wrappers/BaseModalWrapper'
import BaseModalTitle from 'components/Modals/Wrappers/BaseModalTitle'
import ItemSkeleton from 'features/StreamConfiguration/commonComponents/ItemSkeleton'
import searchStreams from 'features/StreamConfiguration/selectors/searchStreams'
import ToolbarSearch from 'components/ToolbarSearch'
import {
  fetchSitesRequested,
  fetchStreamsRequested,
  fetchStreamAuditRequested,
  fetchStreamZoneBitmapRequested,
  fetchStreamSnapShotRequested,
  fetchActiveStreamSnapshotRequested,
  setSearch,
  resetShapes,
} from 'features/StreamConfiguration/streamConfigurationSlice'
import useGlobalSelectedSite from 'common/hooks/useGlobalSelectedSite'

import useStyles from '../../styles'
import { useFlexStyles, useCursorStyles } from 'common/styles/commonStyles'

export default function StreamSelectionModal({ open, handleClose }) {
  const { palette } = useTheme()
  const cursorClasses = useCursorStyles()
  const { account } = useParams()
  const dispatch = useDispatch()
  const siteLoading = useSelector(
    state => state.streamConfiguration.sitesLoading,
  )
  const [globalSelectedSite] = useGlobalSelectedSite()
  const streams = useSelector(searchStreams)
  const sites = useSelector(state => state.streamConfiguration.sites)
  const search = useSelector(state => state.streamConfiguration.search)
  const activeStream = useSelector(
    state => state.streamConfiguration.activeStream,
  )
  const streamsLoading = useSelector(
    state => state.streamConfiguration.streamsLoading,
  )
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const flexClasses = useFlexStyles()

  useEffect(() => {
    dispatch(fetchSitesRequested({ accountSlug: account }))
  }, [account, dispatch])

  useEffect(() => {
    if (
      !isEmpty(globalSelectedSite) &&
      some(sites, ['slug', globalSelectedSite])
    )
      dispatch(
        fetchStreamsRequested({
          accountSlug: account,
          siteSlug: globalSelectedSite,
        }),
      )
  }, [account, dispatch, globalSelectedSite, sites])

  const selectStream = stream => {
    dispatch(resetShapes())
    dispatch(
      fetchActiveStreamSnapshotRequested({
        streamId: stream.id,
      }),
    )

    dispatch(fetchStreamAuditRequested({ id: stream.id }))

    dispatch(
      fetchStreamZoneBitmapRequested({
        stream,
      }),
    )
  }

  const renderContent = stream => {
    if (stream.snapshotLoading) return 'Loading Snapshot...'
    if (isEmpty(stream.snapshot)) return 'No Snapshot Available'
    return (
      <img
        alt=''
        style={{ width: 200, height: 150 }}
        src={stream.snapshot.dataStr}
      />
    )
  }

  const hasAccessReaders = stream => {
    return some(stream.entities, entity => {
      return isArray(entity.accessReaders) && !isEmpty(entity.accessReaders)
    })
  }

  if (siteLoading || (sites && sites.length === 0)) return null

  return (
    <Modal open={open}>
      <BaseModalWrapper width='fit-content' height={600}>
        <BaseModalTitle title='Streams' handleClose={handleClose} />
        <Box mt={1} width={500}>
          <ToolbarSearch
            search={search}
            setSearch={setSearch}
            placeholder={`Search ${get(streams, 'length', '')} streams`}
          />
          {streamsLoading && times(40, i => <ItemSkeleton key={i} />)}
          {map(streams, stream => {
            const name = get(stream, 'name', '')

            return (
              <Tooltip
                key={get(stream, 'id') || name}
                placement='right'
                content={renderContent(stream)}
                onShow={() => {
                  if (stream.snapshotLoading || !isEmpty(stream.snapshot))
                    return true
                  return dispatch(
                    fetchStreamSnapShotRequested({ streamId: stream.id }),
                  )
                }}
              >
                <div
                  className={clsx(
                    'am-subtitle1',
                    classes.streamItem,
                    cursorClasses.pointer,
                    {
                      [classes.activeStream]:
                        get(stream, 'id') === get(activeStream, 'id'),
                    },
                  )}
                  onClick={() => {
                    selectStream(stream)
                    handleClose()
                  }}
                >
                  <span style={{ marginRight: 16 }}>
                    <Icon icon='video' color={palette.grey[700]} size={12} />
                  </span>

                  <div
                    className={clsx(flexClasses.row, flexClasses.centerBetween)}
                  >
                    <span className={classes.streamText}>
                      {truncate(name, { length: 30 })}
                    </span>

                    {!hasAccessReaders(stream) && (
                      <span className={classes.roomIconContainer}>
                        <NoMeetingRoomOutlinedIcon
                          htmlColor={palette.grey[700]}
                          fontSize='small'
                          classes={{
                            fontSizeSmall: classes.roomIconfontSizeSmall,
                          }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </Tooltip>
            )
          })}
        </Box>
      </BaseModalWrapper>
    </Modal>
  )
}
