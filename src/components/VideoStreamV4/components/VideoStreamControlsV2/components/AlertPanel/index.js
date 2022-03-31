import React, { memo, useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import find from 'lodash/find'
import { useSelector, useDispatch, batch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IconButton from '@material-ui/core/IconButton'
import { Icon } from 'react-icons-kit'
import { chevronRight } from 'react-icons-kit/feather/chevronRight'
import clsx from 'clsx'
// src
import MoreOptionMenu from 'ambient_ui/components/optionMenu/MoreOptionMenu'
import { CircularProgress } from 'ambient_ui'
import OverflowTip from 'components/OverflowTip'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import {
  resetSearch,
  setVideoStreamValues,
} from 'redux/slices/videoStreamControls'
import ExpandableSidebar from 'components/ExpandableSidebar'
import Evidence from 'components/AlertCommon/Evidence'
import TimelineV4 from 'components/AlertCommon/TimelineV4'
import DispatchMap from 'components/AlertEvent/DispatchMap'
import getTimeline from 'selectors/alertModal/getTimeline'
import {
  dismissAlertEventRequested,
  removeAlert as removeAlertEvent,
} from 'components/NewsFeed/feedSlice'
import { removeAlert as removeAlertAction } from 'redux/slices/operatorPage'
import {
  createCommentRequested,
  deleteCommentRequested,
  updateCommentRequested,
  resolveAlertRequested,
} from 'redux/slices/alertModal'
import getResolvedStatus from 'selectors/alertModal/getResolvedStatus'
import ConfirmDialog from 'components/ConfirmDialog'
import ResponderList from 'components/AlertCommon/ResponderList'
import ExternalProfileList from 'components/Modal/ExternalProfileList'
import getResponders from 'selectors/alertModal/getResponders'
import getShares from 'selectors/alertModal/getShares'
import { Can } from 'rbac'
import AlertModalControls from 'components/Modal/AlertModalControls'

import useTriggerResize from '../../../../../../common/hooks/useTriggerResize'

import useStyles from './styles'
import trackEventToMixpanel from '../../../../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../../../../enums'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  videoStreamKey: PropTypes.string.isRequired,
  getForensicsResults: PropTypes.func,
  gotoPlaybackTime: PropTypes.func,
  timezone: PropTypes.string,
  alert: PropTypes.object,
  alertEventId: PropTypes.number,
  alertEventHash: PropTypes.string,
  siteSlug: PropTypes.string,
  siteName: PropTypes.string,
  streamName: PropTypes.string,
  initTs: PropTypes.number,
  alertInstances: PropTypes.array,
  hideAlertTimeline: PropTypes.bool,
  hideAlertModalControls: PropTypes.bool,
  hideResponderList: PropTypes.bool,
  canRecall: PropTypes.bool,
  deviceId: PropTypes.string,
}

const defaultProps = {
  hideAlertTimeline: false,
  hideAlertModalControls: false,
  hideResponderList: false,
  canRecall: false,
  deviceId: null,
}

const ICON_SIZE = 20

function AlertPanel({
  accountSlug,
  videoStreamKey,
  timezone,
  alertEventId,
  alertEventHash,
  siteSlug,
  siteName,
  streamName,
  initTs,
  coordinates,
  alertName,
  alertInstances,
  hideAlertTimeline,
  hideAlertModalControls,
  hideResponderList,
  canRecall,
  deviceId,
}) {
  const darkMode = useSelector(state => state.settings.darkMode)
  const dismissLoading = useSelector(state => state.feed.dismissLoading)
  const classes = useStyles({ darkMode })

  const dispatch = useDispatch()

  const triggerResize = useTriggerResize()

  const [currentTab, setCurrentTab] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [commentToDeleteContent, setCommentToDeleteContent] = useState(null)
  const [markFalseDialog, setMarkFalseDialog] = useState(false)

  const { lat, lng } = coordinates
  const timeline = useSelector(getTimeline)
  const responders = useSelector(getResponders)
  const shares = useSelector(getShares)
  const isResolved = useSelector(getResolvedStatus)

  const showResultsPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showAlertPanel',
    }),
  )

  useLayoutEffect(triggerResize, [triggerResize])

  const toggleSidebar = open => {
    batch(() => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            showAlertPanel: open,
            showForensicsPanel: false,
          },
        }),
      )
      dispatch(resetSearch({ videoStreamKey }))
    })
    triggerResize()
  }

  const onAddComment = comment => {
    // trackEventToMixpanel(MixPanelEventEnum.COMMENT_CREATE)
    dispatch(
      createCommentRequested({
        data: {
          comment,
          contentObjectType: 'AMBIENT_ALERT',
          objectId: alertEventId,
        },
      }),
    )
  }

  const onUpdateComment = (event, id, comment) => {
    // trackEventToMixpanel(MixPanelEventEnum.COMMENT_EDIT)
    dispatch(updateCommentRequested({ data: { id, comment } }))
  }

  const onDeleteComment = (event, id) => {
    setCommentIdToDelete(id)
    const commentToDeleteContentToSave = get(
      find(timeline, { id, __typename: 'CommentType' }),
      'comment',
      '',
    )
    setCommentToDeleteContent(commentToDeleteContentToSave)
    setShowConfirmDialog(true)
  }

  const onCancelCommentDeletion = () => {
    setShowConfirmDialog(false)
    setCommentToDeleteContent(null)
  }

  const confirmCommentDeletion = () => {
    // trackEventToMixpanel(MixPanelEventEnum.COMMENT_DELETE)
    dispatch(deleteCommentRequested({ data: { id: commentIdToDelete } }))
    return setShowConfirmDialog(false)
  }

  const confirmMarkFalse = () => {
    dispatch(
      dismissAlertEventRequested({
        alertEventId,
        alertEventHash,
      }),
    )
    setMarkFalseDialog(false)
  }
  const onCancelMarkFalse = () => {
    setMarkFalseDialog(false)
  }

  const overflowTip = deviceId
    ? `${streamName} @ ${siteName} on ${deviceId}`
    : `${streamName} @ ${siteName}`

  return (
    <ExpandableSidebar
      isOpen={showResultsPanel}
      toggleSidebar={toggleSidebar}
      width={400}
      contentHeight='calc(100% - 32px)'
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

      <ConfirmDialog
        open={showConfirmDialog}
        onConfirm={confirmCommentDeletion}
        onClose={onCancelCommentDeletion}
        loading={false}
        content={
          commentToDeleteContent
            ? `Delete comment: "${commentToDeleteContent}"?`
            : 'Delete comment?'
        }
      />

      <ConfirmDialog
        open={markFalseDialog}
        onConfirm={confirmMarkFalse}
        onClose={onCancelMarkFalse}
        loading={false}
        content={
          'This event has been detected frequently in the last few minutes on this stream. Is this a false alert?'
        }
      />

      <Grid container className={classes.alertDetailsWrapper}>
        <Grid item xs={12} sm={12} lg={12} md={12} xl={12}>
          <div className={classes.header}>
            <div className={classes.names}>
              <Typography variant='h5' display='block'>
                <OverflowTip text={alertName} />
              </Typography>
              <Typography variant='subtitle2' noWrap>
                <span className={classes.sectionTitle}>
                  <OverflowTip text={overflowTip} />
                </span>
              </Typography>
            </div>
            {canRecall &&
              (dismissLoading ? (
                <CircularProgress size={ICON_SIZE} />
              ) : (
                <Grid item className={classes.moreOptions}>
                  <MoreOptionMenu
                    darkMode={darkMode}
                    iconSize={ICON_SIZE}
                    menuItems={[
                      {
                        label: 'Mark as False Alert',
                        onClick: () => {
                          setMarkFalseDialog(true)
                        },
                      },
                    ]}
                  />
                </Grid>
              ))}
          </div>
        </Grid>
      </Grid>

      <Tabs
        value={currentTab}
        className={classes.tabs}
        onChange={(_, newTab) => {
          if (newTab === 0)
            trackEventToMixpanel(
              MixPanelEventEnum.VMS_SIDEBAR_ALERT_DETAILS_OPENED,
            )
          if (newTab === 1)
            trackEventToMixpanel(MixPanelEventEnum.VMS_SIDEBAR_TIMELINE_OPENED)
          if (newTab === 2)
            trackEventToMixpanel(
              MixPanelEventEnum.VMS_SIDEBAR_RESPONDERS_OPENED,
            )
          setCurrentTab(newTab)
        }}
      >
        <Tab label='Alert Details' className={classes.tabTitle} />
        {!hideAlertTimeline && (
          <Tab label='Timeline' className={classes.tabTitle} />
        )}
        {!hideResponderList && (
          <Tab label='Responders' className={classes.tabTitle} />
        )}
      </Tabs>

      <div
        className={clsx(
          classes.tab,
          classes.detailsContainer,
          currentTab === 0 && classes.activeTab,
        )}
      >
        <div
          className={clsx(
            'am-subtitle',
            classes.sectionTitle,
            classes.sectionTitleSpacing,
          )}
        >
          Incident
        </div>
        <div className={classes.roundedWrapper}>
          <Evidence alertInstances={alertInstances} />
        </div>
        {!hideAlertModalControls && lat && lng && (
          <>
            <div
              className={clsx(
                'am-subtitle',
                classes.sectionTitle,
                classes.sectionTop,
                classes.sectionTitleSpacing,
              )}
            >
              Location
            </div>
            <div className={clsx(classes.mapWrapper, classes.roundedWrapper)}>
              <DispatchMap lat={lat} lng={lng} />
            </div>
          </>
        )}
      </div>

      {/* TIMELINE */}
      {!hideAlertTimeline && (
        <div
          className={clsx(
            classes.timelineWrapper,
            classes.tab,
            currentTab === 1 && classes.activeTab,
          )}
        >
          <TimelineV4
            timeline={timeline}
            onAddComment={onAddComment}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
            resolved={isResolved}
            timezone={timezone}
            initTs={initTs}
          />
        </div>
      )}

      {!hideResponderList && (
        <div
          className={clsx(
            classes.respondersWrapper,
            classes.tab,
            currentTab === 2 && classes.activeTab,
          )}
        >
          <div className={clsx('am-subtitle', classes.sectionTitle)}>
            Security Officers
          </div>
          <div className={classes.responderListContainer}>
            <ResponderList
              responders={responders}
              alertEventId={alertEventId}
              alertEventHash={alertEventHash}
            />
          </div>

          <div className={clsx('am-subtitle', classes.sectionTitle)}>
            External Shares
          </div>
          <div className={classes.responderListContainer}>
            <ExternalProfileList shares={shares} />
          </div>
        </div>
      )}

      {!hideAlertModalControls && (
        <Can I='request_dispatch' on='Alerts'>
          <div className={classes.controlsWrapper}>
            <AlertModalControls
              dropdownButtonCustomStyle={{ padding: 4 }}
              buttonCustomStyle={{ padding: 8 }}
              accountSlug={accountSlug}
              siteSlug={siteSlug}
              alertEventId={alertEventId}
              alertEventHash={alertEventHash}
              resolved={isResolved}
              onResolve={() => {
                dispatch(removeAlertAction({ alertEventId }))
                dispatch(removeAlertEvent({ alertEventId }))
                dispatch(
                  resolveAlertRequested({
                    alertEventId,
                    alertEventHash,
                  }),
                )
              }}
            />
          </div>
        </Can>
      )}
    </ExpandableSidebar>
  )
}

AlertPanel.propTypes = propTypes
AlertPanel.defaultProps = defaultProps

export default memo(AlertPanel)
