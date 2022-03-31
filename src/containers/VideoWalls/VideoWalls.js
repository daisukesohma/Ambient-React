import React, { useEffect } from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { DragDropContext } from 'react-beautiful-dnd'
import { useParams, useHistory } from 'react-router-dom'
import parseInt from 'lodash/parseInt'

import {
  setStreamCell,
  setActiveVideoWall,
  clearStreamCell,
} from '../../redux/slices/videoWall'
import { fetchSitesByAccountRequested } from '../../redux/site/actions'
import RouteLeavingGuard from '../../hoc/routeLeavingGuard'
import isEditorDirty from '../../selectors/videoWalls/isEditorDirty'
import VideoWallToolbar from '../../components/VideoWallToolbar'

import VideoWallGrid from './components/VideoWallGrid'
import useStyles from './styles'
import useEdit from './hooks/useEdit'
import trackEventToMixpanel from '../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../enums'

function VideoWalls() {
  const history = useHistory()
  const isEdit = useEdit()
  const activeVideoWall = useSelector(state => state.videoWall.activeVideoWall)
  const isDirty = useSelector(isEditorDirty({ isEdit }))
  const classes = useStyles()
  const { account } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSitesByAccountRequested(account))
  }, [dispatch, account])

  const onDragEnd = result => {
    const { source, destination } = result

    if (!destination || source.droppableId === destination.droppableId) return

    if (source.droppableId === 'video-wall-toolbar') {
      const [destinationOrderIndex] = destination.droppableId.split('-')
      dispatch(
        setStreamCell({
          orderIndex: parseInt(destinationOrderIndex),
          streamId: source.index,
        }),
      )
    } else {
      // Swap Streams
      const [
        destinationOrderIndex,
        destinationStreamId,
      ] = destination.droppableId.split('-')
      const [sourceOrderIndex, sourceStreamId] = source.droppableId.split('-')

      batch(() => {
        if (parseInt(sourceStreamId)) {
          dispatch(
            setStreamCell({
              orderIndex: parseInt(destinationOrderIndex),
              streamId: parseInt(sourceStreamId),
            }),
          )
        } else {
          dispatch(
            clearStreamCell({
              orderIndex: parseInt(destinationOrderIndex),
            }),
          )
        }
        if (parseInt(destinationStreamId)) {
          dispatch(
            setStreamCell({
              orderIndex: parseInt(sourceOrderIndex),
              streamId: parseInt(destinationStreamId),
            }),
          )
        } else {
          dispatch(
            clearStreamCell({
              orderIndex: parseInt(sourceOrderIndex),
            }),
          )
        }
      })
    }
  }

  return (
    <>
      <RouteLeavingGuard
        when={isDirty}
        onNavigate={path => {
          dispatch(setActiveVideoWall({ activeVideoWall: null }))
          history.push(path)
        }}
        shouldBlockNavigation={location => isDirty}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container className={classes.root}>
          <VideoWallToolbar
            addToPlayer
            activeVideoWall={activeVideoWall}
            onVideoWallSelect={videoWall => {
              history.push(`/accounts/${account}/video-walls/${videoWall.id}`)
            }}
          />

          <Grid item style={{ flex: 1 }}>
            <VideoWallGrid />
          </Grid>
        </Grid>
      </DragDropContext>
    </>
  )
}

export default VideoWalls
