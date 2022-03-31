import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { isMobile } from 'react-device-detect'
import get from 'lodash/get'
import find from 'lodash/find'
import clsx from 'clsx'
// src
import Apollo from 'providers/apollo'
import { removeAlert as removeAlertEvent } from 'components/NewsFeed/feedSlice'
import { removeAlert as removeAlertAction } from 'redux/slices/operatorPage'
import { StreamTypeEnum } from 'enums'
import VideoStreamComponent from 'components/VideoStreamComponent'
import config from 'config'

import Evidence from '../../AlertCommon/Evidence'
import {
  resetState,
  fetchDispatchStatusSucceeded,
  createCommentRequested,
  updateCommentRequested,
  deleteCommentRequested,
  resolveAlertRequested,
} from 'redux/slices/alertModal'
import DispatchMap from '../../AlertEvent/DispatchMap'
import ResponderList from '../../AlertCommon/ResponderList'
import TimelineV2 from '../../AlertCommon/TimelineV2'
import ExternalProfileList from '../ExternalProfileList'
import AlertModalControls from '../AlertModalControls'
import ConfirmDialog from 'components/ConfirmDialog'
import getResponders from '../../../selectors/alertModal/getResponders'
import getTimeline from '../../../selectors/alertModal/getTimeline'
import getShares from '../../../selectors/alertModal/getShares'
import getResolvedStatus from '../../../selectors/alertModal/getResolvedStatus'
import { GET_DISPATCH_STATUS } from '../../../sagas/alertModal/gql'
import { Can } from 'rbac'

import useStyles from './styles'

const propTypes = {
  titleStyles: PropTypes.object,
  isHigh: PropTypes.bool,

  alertEventId: PropTypes.number,
  alertEventHash: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  nodeId: PropTypes.number,
  timezone: PropTypes.string,
  initTs: PropTypes.number,
  siteName: PropTypes.string,
  streamName: PropTypes.string,
  alertTs: PropTypes.number,
  coordinates: PropTypes.object,
  alertName: PropTypes.string,
  alertInstances: PropTypes.array,
  deviceId: PropTypes.string,
}

const defaultProps = {
  titleStyles: {},
  isHigh: false,
  deviceId: null,
}

function AlertModalV1({
  titleStyles,
  isHigh,
  alertEventId,
  alertEventHash,
  siteSlug,
  streamId,
  nodeId,
  timezone,
  initTs,
  siteName,
  streamName,
  alertTs,
  coordinates,
  alertName,
  alertInstances,
  deviceId,
}) {
  const classes = useStyles({ isMobile })
  const dispatch = useDispatch()
  const { account } = useParams()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [commentToDeleteContent, setCommentToDeleteContent] = useState(null)

  const responders = useSelector(getResponders)
  const timeline = useSelector(getTimeline)
  const shares = useSelector(getShares)
  const isResolved = useSelector(getResolvedStatus)
  const isDemo = config.settings.demo

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

  const fetchDispatchStatus = useCallback(() => {
    Apollo.client
      .query({
        query: GET_DISPATCH_STATUS,
        variables: {
          alertEventId,
          alertEventHash,
        },
      })
      .then(response => {
        dispatch(fetchDispatchStatusSucceeded(response.data))
      })
      .catch(error => {
        throw error
      })
  }, [alertEventId, alertEventHash, dispatch])

  useEffect(() => {
    fetchDispatchStatus()
    const intervalId = setInterval(fetchDispatchStatus, 5000)
    return () => {
      dispatch(resetState())
      clearInterval(intervalId)
    }
  }, [fetchDispatchStatus, dispatch])

  let caption = ''
  if (streamName) {
    caption += `${streamName}`
  }

  if (siteName) {
    caption += `@ ${siteName}`
  }

  if (deviceId) {
    caption += ` on ${deviceId}`
  }

  return (
    <Grid container direction='row' className={classes.AlertModalLayout}>
      <Grid
        container
        className={classes.AlertModalLayoutTitle}
        style={titleStyles}
      >
        <Grid item xs={12} sm={12} lg={12} md={12} xl={12}>
          <Typography variant='h5' display='block'>
            {alertName}
          </Typography>
          <Typography variant='caption' noWrap>
            {caption}
          </Typography>
        </Grid>
      </Grid>
      <Divider
        variant='fullWidth'
        light={false}
        className={classes.AlertModalLayoutDivider}
      />
      <Grid
        container
        style={{ backgroundColor: '#f8fafb' }}
        className={classes.rowGrid}
      >
        {streamId && (
          <Grid
            item
            xs={12}
            sm={12}
            lg={6}
            md={6}
            xl={6}
            className={classes.AlertModalLayoutColumn}
          >
            <VideoStreamComponent
              accountSlug={account}
              siteSlug={siteSlug}
              streamId={Number(streamId)}
              nodeId={nodeId}
              viewMode={StreamTypeEnum.NORMAL}
              videoStreamKey='modal'
              willAutoLoad={!isMobile}
              key={alertEventId}
              showPlaybackControls
              initTS={isDemo ? null : initTs}
              initTs={isDemo ? null : initTs}
              minStreamHeight='600px' // not used on Revamped Video Stream
              isOnAlertModal
              timezone={timezone}
              isMobile={isMobile}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={12}
          lg={streamId ? 3 : 4}
          md={streamId ? 3 : 4}
          xl={streamId ? 3 : 4}
          className={classes.AlertModalLayoutColumn}
          style={{ flexDirection: 'column' }}
        >
          {streamId && (
            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              md={12}
              xl={12}
              className={classes.clipContainer}
            >
              <Evidence alertInstances={alertInstances} />
            </Grid>
          )}
          <Grid item xs={12} sm={12} lg={12} md={12} xl={12}>
            <DispatchMap lat={coordinates.lat} lng={coordinates.lng} />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={streamId ? 3 : 8}
          md={streamId ? 3 : 8}
          xl={streamId ? 3 : 8}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            md={12}
            xl={12}
            className={classes.AlertModalLayoutTimelineColumn}
          >
            {!isHigh && (
              <TimelineV2
                timeline={timeline}
                onAddComment={onAddComment}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                resolved={isResolved}
                timezone={timezone}
                alertTs={alertTs}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider variant='fullWidth' light={false} className={classes.divider} />
      <Grid container className={classes.rowGrid}>
        <Grid container item mt={1} xs={12} sm={12} lg={8} md={7} xl={8}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={6}
            md={6}
            xl={6}
            className={classes.AlertModalLayoutDispatchInfo}
          >
            <div className={clsx('subtitle2', classes.sectionTitle)}>
              Security Officers
            </div>
            <div className={classes.responderListContainer}>
              <ResponderList
                responders={responders}
                alertEventId={alertEventId}
                alertEventHash={alertEventHash}
              />
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            lg={6}
            md={6}
            xl={6}
            className={classes.AlertModalLayoutDispatchInfo}
          >
            <div className={clsx('subtitle2', classes.sectionTitle)}>
              External Shares
            </div>
            <div className={classes.responderListContainer}>
              <ExternalProfileList shares={shares} />
            </div>
          </Grid>
        </Grid>
        <Can I='request_dispatch' on='Alerts'>
          <Grid item xs={12} sm={12} lg={4} md={5} xl={4}>
            <AlertModalControls
              accountSlug={account}
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
          </Grid>
        </Can>
      </Grid>
      <Divider variant='fullWidth' light={false} className={classes.divider} />
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
    </Grid>
  )
}

AlertModalV1.propTypes = propTypes
AlertModalV1.defaultProps = defaultProps

export default AlertModalV1
