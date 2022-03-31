import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import find from 'lodash/find'
import get from 'lodash/get'
import map from 'lodash/map'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'
import { Droppable } from 'react-beautiful-dnd'
import LinearProgress from '@material-ui/core/LinearProgress'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
// src
import { Icons } from 'ambient_ui'
import { setActiveVideoWall } from 'redux/slices/videoWall'
import allStreams from 'selectors/sites/allStreams'
import VideoStreamComponent from 'components/VideoStreamComponent'

import useEdit from '../../hooks/useEdit'
import useStreamView from '../../hooks/useStreamView'
import VideoWallCell from '../VideoWallCell'
import VideoWallCellHover from '../VideoWallCellHover'
import VideoWallPlayer from '../../../../components/VideoWallPlayer'
import getStreamByCell from '../utils/getStreamByCell'
import VideoWallTemplateSelector from '../VideoWallTemplateSelector'
import isAdminSelector from 'selectors/auth/isAdmin'
import useFeature from '../../../../common/hooks/useFeature'

import useStyles from './styles'
import useMixpanel from '../../../../mixpanel/hooks/useMixpanel'
import { MixPanelEventEnum } from '../../../../enums'

function VideoWallGrid() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { palette } = useTheme()

  const { account, videoWallId, streamId } = useParams()

  const activeVideoWall = useSelector(state => state.videoWall.activeVideoWall)
  const currentUserId = useSelector(state => state.auth.user.id)
  const isOwner = currentUserId === get(activeVideoWall, 'owner.user.id')
  const isInternal = useSelector(state => state.auth.user.internal)
  const isAdmin = useSelector(isAdminSelector)
  const darkMode = useSelector(state => state.settings.darkMode)
  const streams = useSelector(allStreams)
  const videoWalls = useSelector(state => state.videoWallToolbar.videoWalls)
  const videoWallCreationLoading = useSelector(
    state => state.videoWallToolbar.creationLoading,
  )
  const videoWallEditLoading = useSelector(
    state => state.videoWallToolbar.editLoading,
  )
  const videoWallDeleteLoading = useSelector(
    state => state.videoWallToolbar.deleteLoading,
  )
  const folderCreationLoading = useSelector(
    state => state.videoWallToolbar.folderCreationLoading,
  )
  const folderEditLoading = useSelector(
    state => state.videoWallToolbar.folderEditLoading,
  )
  const folderDeleteLoading = useSelector(
    state => state.videoWallToolbar.folderDeleteLoading,
  )
  const [fullscreen, setFullscreen] = useState(false)

  useMixpanel(MixPanelEventEnum.VIDEO_WALL_OPENED, { videoWallId }, [
    videoWallId,
  ])

  const isVideoWallPlayerActive = useFeature({
    accountSlug: account,
    feature: 'VIDEO_WALL_PLAYER',
  })

  const isEdit = useEdit() && (isOwner || isInternal || isAdmin)

  const streamViewMode = useStreamView()

  const classes = useStyles({ isEdit, darkMode, activeVideoWall })

  const [hovered, setHover] = useState(false)
  const videoWallRef = useRef(null)

  const openFullscreen = () => {
    if (videoWallRef) {
      if (videoWallRef.current.requestFullscreen) {
        videoWallRef.current.requestFullscreen()
        setFullscreen(true)
      } else if (videoWallRef.current.webkitRequestFullscreen) {
        /* Safari */
        videoWallRef.current.webkitRequestFullscreen()
        setFullscreen(true)
      } else if (videoWallRef.current.msRequestFullscreen) {
        /* IE11 */
        videoWallRef.current.msRequestFullscreen()
        setFullscreen(true)
      }
    }
  }

  document.addEventListener('fullscreenchange', exitHandler)
  document.addEventListener('webkitfullscreenchange', exitHandler)
  document.addEventListener('mozfullscreenchange', exitHandler)
  document.addEventListener('MSFullscreenChange', exitHandler)

  function exitHandler() {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setFullscreen(false)
    }
  }

  const closeFullscreen = () => {
    console.log('fired')
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen()
    }
  }

  useEffect(() => {
    if (videoWalls && videoWalls.length) {
      if (videoWallId) {
        dispatch(
          setActiveVideoWall({
            activeVideoWall: find(videoWalls, { id: videoWallId }),
          }),
        )
      } else if (!streamId) {
        // find the very first one
        history.push(`/accounts/${account}/video-walls/${videoWalls[0].id}`)
      }
    }
  }, [videoWallId, dispatch, videoWalls, account, history, streamId])

  const onVideoWallChange = useCallback(
    nextVideoWall => {
      history.push(`/accounts/${account}/video-walls/${nextVideoWall.id}`)
    },
    [history, account],
  )

  const renderProgressBar = () => {
    return (
      <>
        {(videoWallCreationLoading ||
          videoWallEditLoading ||
          videoWallDeleteLoading ||
          folderCreationLoading ||
          folderEditLoading ||
          folderDeleteLoading) && (
          <LinearProgress className={classes.progressBar} />
        )}
      </>
    )
  }

  if (streamViewMode) {
    const selectedStream = find(
      streams,
      stream => stream.id === parseInt(streamId, 10),
    )

    return (
      <Grid
        className={classes.videoWallContainer}
        container
        direction='column'
        justify='center'
        alignItems='center'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'relative' }}
      >
        {selectedStream && (
          <>
            {hovered && !isEdit && (
              <VideoWallCellHover selectedStream={selectedStream} />
            )}
            <VideoStreamComponent
              containerStyle={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
              accountSlug={account}
              siteSlug={selectedStream.siteSlug}
              streamName={get(selectedStream, 'stream.name', null)}
              streamId={selectedStream.streamId}
              nodeId={selectedStream.nodeId}
              viewMode='JPG'
              willAutoLoad
              showPlaybackControls={false}
              initTS={null}
              streamType='JPG'
              fluid
              timezone={selectedStream.timezone}
              isOnVideoWall
              videoStreamKey='video-stream-view-modal'
            />
          </>
        )}
      </Grid>
    )
  }

  if (!activeVideoWall) {
    return (
      <Grid
        className={classes.root}
        container
        direction='column'
        justify='center'
        alignItems='center'
      >
        {renderProgressBar()}
        <div>
          <Typography className='am-h3'>
            Create your first video wall.
          </Typography>
        </div>
        <div>
          <Typography className={clsx('am-body1 ', classes.descriptionText)}>
            Choose one of the grid layouts above and then select streams for
            each box.
          </Typography>
        </div>
        {isVideoWallPlayerActive && (
          <VideoWallPlayer onVideoWallChange={onVideoWallChange} />
        )}
      </Grid>
    )
  }

  return (
    <div className={classes.root}>
      {renderProgressBar()}
      {isEdit && <VideoWallTemplateSelector />}
      {!isEdit && (
        <Grid container justify='flex-end'>
          <IconButton onClick={openFullscreen}>
            <Icons.Maximize width={24} height={24} stroke={palette.grey[100]} />
          </IconButton>
        </Grid>
      )}
      <div className={classes.videoWallContainer} ref={videoWallRef}>
        {!isEmpty(activeVideoWall) && !isEmpty(activeVideoWall.template) && (
          <div className={classes.gridContainer}>
            {map(activeVideoWall.template.shape, (cell, orderIndex) => {
              const selectedStream = getStreamByCell(
                streams,
                activeVideoWall.streamFeeds,
                orderIndex,
              )

              return (
                <Droppable
                  key={orderIndex}
                  droppableId={`${orderIndex}-${get(
                    selectedStream,
                    'streamId',
                  )}`}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        gridRowStart: cell[0] + 1,
                        gridColumnStart: cell[1] + 1,
                        gridRowEnd: cell[2] + 1,
                        gridColumnEnd: cell[3] + 1,
                      }}
                      className={clsx(classes.gridItem, {
                        [classes.isDroppableActive]: snapshot.isDraggingOver,
                      })}
                    >
                      <VideoWallCell
                        streams={streams}
                        cell={cell}
                        orderIndex={orderIndex}
                        fullscreen={fullscreen}
                        closeFullscreen={closeFullscreen}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )
            })}
          </div>
        )}
        {!activeVideoWall.template && (
          <Grid
            container
            item
            direction='row'
            justify='center'
            alignItems='center'
            style={{ height: '100%' }}
          >
            <Typography>Select Template for Video Wall in Edit Mode</Typography>
          </Grid>
        )}
        {isVideoWallPlayerActive && !isEdit && (
          <VideoWallPlayer onVideoWallChange={onVideoWallChange} />
        )}
      </div>
    </div>
  )
}

export default VideoWallGrid
