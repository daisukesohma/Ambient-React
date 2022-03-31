import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch, batch } from 'react-redux'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import omit from 'lodash/omit'
import clsx from 'clsx'
import { Droppable } from 'react-beautiful-dnd'
import { isMobile } from 'react-device-detect'
import getSelectedSites from 'selectors/operatorPage/getSelectedSites'
import { setNewsFeedTabIndex } from 'redux/slices/settings'
import { AlertEventStatusEnum, ActivityTypeEnum } from 'enums'
import {
  fetchVideoWallSucceeded,
  updateVideoWallRequested,
} from 'redux/slices/operatorPage'
import config from 'config'

import ActivityCard from '../Activity/ActivityCard'
import AlertEventCard from '../AlertEventCard'
import sortedByTime from '../../selectors/feed/sortedByTime'
import notResolvedAlertsSelector from '../../selectors/feed/notResolvedAlerts'
import useInterval from '../../common/hooks/useInterval'
import VideoWallToolbar from '../VideoWallToolbar'
import SeverityTypeEnum from '../../enums/SeverityTypeEnum'

import { PANEL_ITEMS_LIMIT, POLL_INTERVAL } from './constants'

import {
  fetchAlertEventsRequested,
  fetchActivityLogsFetchRequested,
  alertEventsPulseRequested,
  activityLogsPulseFetchRequested,
  // setDismissModalClose,
  // dismissAlertEventRequested,
} from './feedSlice'
import useStyles from './styles'

const propTypes = {
  operatorPage: PropTypes.bool,
}

const defaultProps = {
  operatorPage: false,
}

const NewsFeed = ({ operatorPage }) => {
  const dispatch = useDispatch()
  const { account } = useParams()
  const darkMode = useSelector(state => state.settings.darkMode)
  const activeVideoWall = useSelector(state => state.operatorPage.videoWall)
  const alertEvents = useSelector(state => state.feed.alertEvents)
  const selectedSites = useSelector(getSelectedSites)
  const tabIndex = useSelector(state => state.settings.newsFeedTabIndex)
  const activityLogs = useSelector(sortedByTime)
  const notResolvedAlerts = useSelector(notResolvedAlertsSelector)
  const isDemo = config.settings.demo

  const alertsPulseLoading = useSelector(state => state.feed.alertsPulseLoading)
  const activitiesPulseLoading = useSelector(
    state => state.feed.activitiesPulseLoading,
  )

  // Keeping this here for when we want to enable dismissing of alerts on newsfeed
  // const dismissOpened = useSelector(state => state.feed.dismissOpened)
  // const alertEventIdToDismiss = useSelector(
  //   state => state.feed.alertEventIdToDismiss,
  // )
  // const alertEventHashToDismiss = useSelector(
  //   state => state.feed.alertEventHashToDismiss,
  // )

  const classes = useStyles({ darkMode })

  // const dismissAlertConfirm = () => {
  //   dispatch(
  //     dismissAlertEventRequested({
  //       alertEventId: alertEventIdToDismiss,
  //       alertEventHash: alertEventHashToDismiss,
  //     }),
  //   )
  // }

  // TODO: move it to sockets in the future. For now, it will be polling
  useInterval(() => {
    if (isDemo || isEmpty(account) || alertsPulseLoading) return

    dispatch(
      alertEventsPulseRequested({
        accountSlug: account,
        status: AlertEventStatusEnum.RAISED,
        limit: PANEL_ITEMS_LIMIT,
        severities: [SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1],
        siteSlugs: map(selectedSites, 'slug'),
      }),
    )
  }, POLL_INTERVAL)

  useInterval(() => {
    if (isEmpty(account) || activitiesPulseLoading) return

    dispatch(
      activityLogsPulseFetchRequested({
        accountSlug: account,
        status: AlertEventStatusEnum.RAISED,
        siteSlugs: map(selectedSites, 'slug'),
        limit: PANEL_ITEMS_LIMIT,
      }),
    )
  }, POLL_INTERVAL)

  useEffect(() => {
    if (isDemo) return

    dispatch(
      fetchAlertEventsRequested({
        accountSlug: account,
        status: AlertEventStatusEnum.RAISED,
        limit: PANEL_ITEMS_LIMIT,
        siteSlugs: map(selectedSites, 'slug'),
        severities: [SeverityTypeEnum.SEV_0, SeverityTypeEnum.SEV_1],
      }),
    )
  }, [dispatch, account, selectedSites])

  useEffect(() => {
    dispatch(
      fetchActivityLogsFetchRequested({
        accountSlug: account,
        status: AlertEventStatusEnum.RAISED,
        siteSlugs: map(selectedSites, 'slug'),
        limit: PANEL_ITEMS_LIMIT,
      }),
    )
  }, [dispatch, account, selectedSites])

  const renderAlerts = useMemo(() => {
    return map(alertEvents, (alertEvent, index) => {
      const initialExpanded = includes(isMobile ? [0, 1, 2] : [0], index)
      return (
        <AlertEventCard
          alertEvent={alertEvent}
          key={`alert-${get(alertEvent, 'id')}`}
          initialExpanded={initialExpanded}
          operatorPage={operatorPage}
          index={index}
        />
      )
    })
  }, [alertEvents, operatorPage])

  const renderActivityLogs = useMemo(() => {
    return (
      <div>
        {activityLogs.map((activityLog, index) => {
          const { id, ts, __typename } = activityLog

          if (__typename === ActivityTypeEnum.AlertEventType) {
            return (
              <AlertEventCard
                alertEvent={{ ...activityLog, tsCreated: ts }}
                key={`activity-logs-${__typename}-${id}`}
                initialExpanded={false}
                operatorPage={operatorPage}
                index={index}
                activityVersion
              />
            )
          }
          return (
            <ActivityCard
              activityLog={activityLog}
              key={`activity-logs-${__typename}-${id}`}
            />
          )
        })}
      </div>
    )
  }, [activityLogs, operatorPage])

  const renderVideoWalls = useMemo(() => {
    return (
      <VideoWallToolbar
        addToPlayer
        activeVideoWall={activeVideoWall}
        enableManage={false}
        showFooter={false}
        showStreams={false}
        defaultOpened={['VideoWalls']}
        onVideoWallSelect={selectedVideoWall => {
          batch(() => {
            // NOTE: for V1 we will do copy of selected video wall and set it to current operator page video wall
            dispatch(
              fetchVideoWallSucceeded({
                videoWall: {
                  ...activeVideoWall,
                  ...omit(selectedVideoWall.object, ['id', 'name']),
                },
              }),
            )
            dispatch(updateVideoWallRequested())
          })
        }}
      />
    )
  }, [dispatch, activeVideoWall])

  const renderTabs = useMemo(() => {
    return (
      <>
        <Tabs
          value={tabIndex}
          indicatorColor='primary'
          variant='fullWidth'
          textColor='secondary'
          onChange={(event, index) => dispatch(setNewsFeedTabIndex({ index }))}
        >
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              wrapper: classes.tabWrapper,
            }}
            label={
              <>
                <span className='am-button' style={{ marginRight: 8 }}>
                  Alerts
                </span>
                {notResolvedAlerts.length > 0 && (
                  <span className={clsx('am-overline', classes.badge)}>
                    {notResolvedAlerts.length}
                  </span>
                )}
              </>
            }
          />
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              wrapper: classes.tabWrapper,
            }}
            label='Activities'
          />
          {operatorPage && (
            <Tab
              disableRipple
              classes={{
                root: classes.tabRoot,
                wrapper: classes.tabWrapper,
              }}
              label='Video Walls'
            />
          )}
        </Tabs>

        <div className={classes.scrollable}>
          {tabIndex === 0 && renderAlerts}
          {tabIndex === 1 && renderActivityLogs}
          {operatorPage && tabIndex === 2 && renderVideoWalls}
        </div>
      </>
    )
  }, [
    classes.tabRoot,
    classes.badge,
    classes.tabWrapper,
    classes.scrollable,
    dispatch,
    notResolvedAlerts,
    renderActivityLogs,
    renderAlerts,
    tabIndex,
    operatorPage,
    renderVideoWalls,
  ])

  return (
    <Box className={classes.root}>
      {/* <ConfirmDialog
        open={dismissOpened}
        content={'This event has been detected frequently in the last few minutes on this stream. Is this a false alert?'}
        onConfirm={dismissAlertConfirm}
        onClose={() => {
          dispatch(setDismissModalClose())
        }}
      /> */}
      {operatorPage ? (
        <Droppable droppableId='news-feed' isDropDisabled>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.droppableRoot}
            >
              {renderTabs}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        renderTabs
      )}
    </Box>
  )
}

NewsFeed.propTypes = propTypes
NewsFeed.defaultProps = defaultProps

export default NewsFeed
