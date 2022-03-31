import React, { useState, useEffect, useCallback } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import CheckIcon from '@material-ui/icons/Check'
import NotInterestedIcon from '@material-ui/icons/NotInterested'
import { CircularProgress } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Fade from '@material-ui/core/Fade'
import RoomTwoToneIcon from '@material-ui/icons/RoomTwoTone'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
// src
import Apollo from 'providers/apollo'
import { createNotification } from 'redux/slices/notifications'
import { DispatchStatusEnum, DatabaseModelTypeEnum } from 'enums'
import {
  GET_DISPATCH_STATUS,
  CREATE_DISPATCH_STATUS,
} from 'components/NewsFeed/saga/gql'
import TimelineV2 from 'components/AlertCommon/TimelineV2'
import ConfirmDialog from 'components/ConfirmDialog'
import {
  createCommentRequested,
  deleteCommentRequested,
  fetchDispatchStatusSucceeded,
  updateCommentRequested,
} from 'redux/slices/alertModal'
import getResponders from 'selectors/alertModal/getResponders'
import getTimeline from 'selectors/alertModal/getTimeline'
import getAlertEvent from 'selectors/alertModal/getAlertEvent'
import getCenterPoint from 'selectors/alertModal/getCenterPoint'

import DispatchInfo from './components/DispatchInfo'
import AlertCommon from './components/AlertCommon'
import { msToUnix } from '../../utils'

const useStyles = makeStyles(theme => ({
  denied: {
    backgroundColor: '#FD235C',
    color: 'white',
  },
}))

const Dispatch = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [content, setContent] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [commentToDeleteContent, setCommentToDeleteContent] = useState(null)
  const responders = useSelector(getResponders)
  const timeline = useSelector(getTimeline)
  const alertEvent = useSelector(getAlertEvent)
  const center = useSelector(getCenterPoint)

  const { alertEventId, alertEventHash, userId } = useParams()

  const [
    createDispatchStatusRequest,
    { data: createDispatchStatusData },
  ] = useMutation(CREATE_DISPATCH_STATUS)

  const getContentForStatus = useCallback(
    status => {
      if (status) {
        switch (status) {
          case DispatchStatusEnum.REQUESTED:
          case DispatchStatusEnum.SEEN:
            return {
              message: 'Are you able to respond to this incident?',
              buttons: [
                {
                  icon: <DirectionsWalkIcon className={classes.iconBtn} />,
                  status: DispatchStatusEnum.CONFIRMED,
                  name: 'Yes',
                  className: 'approve',
                  color: 'primary',
                },
                {
                  icon: <NotInterestedIcon />,
                  name: 'No',
                  className: 'denied',
                  status: 'declined',
                },
              ],
            }
          case DispatchStatusEnum.CONFIRMED:
            return {
              message: 'Have you arrived onsite?',
              buttons: [
                {
                  icon: <RoomTwoToneIcon className={classes.iconBtn} />,
                  status: DispatchStatusEnum.ARRIVED,
                  name: 'Confirm Onsite Arrival',
                },
              ],
            }
          case DispatchStatusEnum.ARRIVED:
            return {
              message: 'Is the incident resolved?',
              buttons: [
                {
                  icon: <CheckIcon className={classes.iconBtn} />,
                  status: DispatchStatusEnum.RESOLVED,
                  name: 'Mark incident resolved',
                },
              ],
            }
          case DispatchStatusEnum.RESOLVED:
            return {
              message: 'Incident has been resolved.',
              status: DispatchStatusEnum.RESOLVED,
            }
          default:
            return {}
        }
      }
      return null
    },
    [classes],
  )

  const fetchDispatchStatus = useCallback(() => {
    return Apollo.client
      .query({
        query: GET_DISPATCH_STATUS,
        variables: {
          alertEventId,
          alertEventHash,
        },
      })
      .then(response => {
        dispatch(fetchDispatchStatusSucceeded(response.data))
        if (response.data) {
          const data = response.data.dispatchStatus
          const dispatches = data.responders.filter(
            d => d.profile.user.id === parseInt(userId, 10),
          )
          const currentStatus = dispatches[0].status
          setContent(getContentForStatus(currentStatus))
          // NB: If the current status is requested, update to SEEN
          if (currentStatus === DispatchStatusEnum.REQUESTED) {
            createDispatchStatusRequest({
              variables: {
                alertEventId,
                alertEventHash,
                userId,
                status: DispatchStatusEnum.SEEN,
              },
            })
          }
        }
      })
  }, [
    alertEventHash,
    alertEventId,
    createDispatchStatusRequest,
    getContentForStatus,
    userId,
    dispatch,
  ])

  useEffect(() => {
    fetchDispatchStatus()
    const intervalId = setInterval(fetchDispatchStatus, 5000)
    return () => clearInterval(intervalId)
  }, [fetchDispatchStatus])

  useEffect(() => {
    if (createDispatchStatusData) {
      const dispatchStatus = get(
        createDispatchStatusData,
        'createDispatchStatus.dispatch.status',
      )
      // NB: seen is an automatic API call. Do not create a notification for this.
      if (dispatchStatus !== DispatchStatusEnum.SEEN) {
        dispatch(
          createNotification({
            message: get(
              createDispatchStatusData,
              'createDispatchStatus.message',
            ),
          }),
        )
      }
    }
  }, [createDispatchStatusData, dispatch])

  const onAddComment = comment => {
    dispatch(
      createCommentRequested({
        data: {
          comment,
          contentObjectType: 'AMBIENT_ALERT',
          objectId: alertEvent.id,
          userId,
        },
      }),
    )
  }

  const onUpdateComment = (event, id, comment) => {
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
    dispatch(deleteCommentRequested({ data: { id: commentIdToDelete } }))
    return setShowConfirmDialog(false)
  }

  const actions = !content ? (
    <CircularProgress />
  ) : (
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        alignItems='center'
      >
        {content.status === DispatchStatusEnum.RESOLVED && (
          <Box m={1}>
            <Fade in>
              <CheckCircleIcon color='primary' />
            </Fade>
          </Box>
        )}
        <Box>
          <Typography>{content.message}</Typography>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
      >
        {content.buttons &&
          content.buttons.map((button, index) => {
            return (
              <Box m={1} key={`dispatch-modal-${index}`}>
                <Button
                  variant='contained'
                  color='primary'
                  className={classes[button.className]}
                  onClick={async () => {
                    setContent(null)
                    await createDispatchStatusRequest({
                      variables: {
                        alertEventId,
                        alertEventHash,
                        userId,
                        status: button.status,
                      },
                    })
                    await fetchDispatchStatus()
                  }}
                >
                  {button.icon}
                  {button.name}
                </Button>
              </Box>
            )
          })}
      </Box>
    </Box>
  )

  return (
    <div>
      {!isEmpty(alertEvent) && (
        <AlertCommon
          actions={actions}
          alertEventOrInstance={alertEvent}
          modelType={DatabaseModelTypeEnum.ALERT_EVENT}
        />
      )}
      <DispatchInfo
        lat={center ? center.lat : null}
        lng={center ? center.lng : null}
        responders={responders}
        timeline={timeline}
      />
      {!isEmpty(alertEvent) && (
        <TimelineV2
          timeline={timeline}
          onAddComment={onAddComment}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          resolved={alertEvent.resolved}
          alertTs={msToUnix(alertEvent.tsIdentifier)}
        />
      )}
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
    </div>
  )
}

export default Dispatch
