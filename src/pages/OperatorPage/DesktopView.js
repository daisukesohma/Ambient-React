import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { DragDropContext } from 'react-beautiful-dnd'
import { parseInt, isEmpty, last, split, get } from 'lodash'
// src
import useMixpanel from 'mixpanel/hooks/useMixpanel'
import config from 'config'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'
import NewsFeed from 'components/NewsFeed'
import DemoPlayback from 'components/DemoPlayback'
import {
  fetchStreamsRequested,
  fetchVideoWallRequested,
  toggleStreamCell,
  updateStreamFeedRequested,
} from 'redux/slices/operatorPage'

import useStyles from './styles'
import OperatorWall from './components/OperatorWall'

export default function DesktopView() {
  const { account } = useParams()
  const classes = useStyles({ isMobile: false })
  const dispatch = useDispatch()
  const videoWall = useSelector(state => state.operatorPage.videoWall)
  const isDemo = config.settings.demo

  const newsFeedPositionLeft = useSelector(
    state => state.settings.newsFeedPositionLeft,
  )

  useMixpanel(MixPanelEventEnum.LIVE_ENTER)
  useEffect(() => {
    dispatch(fetchStreamsRequested({ accountSlug: account }))
    dispatch(fetchVideoWallRequested({ accountSlug: account }))

    return function cleanup() {
      trackEventToMixpanel(MixPanelEventEnum.LIVE_EXIT)
    }
  }, [dispatch, account])

  const onDragEnd = useCallback(
    result => {
      const { draggableId, destination, source } = result
      if (isEmpty(draggableId) || isEmpty(destination)) return
      const streamId = last(split(draggableId, '-'))
      const [orderIndex, revertStreamId] = split(destination.droppableId, '-')

      batch(() => {
        dispatch(
          toggleStreamCell({
            orderIndex: parseInt(orderIndex),
            stream: { id: parseInt(streamId) },
          }),
        )
        dispatch(
          updateStreamFeedRequested({
            orderIndex: parseInt(orderIndex),
            videoWallId: parseInt(get(videoWall, 'id')),
            streamId: parseInt(streamId),
          }),
        )
        if (source.droppableId !== 'news-feed' && !isEmpty(revertStreamId)) {
          const [sortOrderIndex] = split(source.droppableId, '-')
          dispatch(
            toggleStreamCell({
              orderIndex: parseInt(sortOrderIndex),
              stream: { id: parseInt(revertStreamId) },
            }),
          )
          dispatch(
            updateStreamFeedRequested({
              orderIndex: parseInt(sortOrderIndex),
              videoWallId: parseInt(get(videoWall, 'id')),
              streamId: parseInt(revertStreamId),
            }),
          )
        }
      })
    },
    [dispatch, videoWall],
  )

  const renderNewsFeed = useMemo(() => {
    return (
      <Grid item lg={3} md={3} sm={3} xs={3} className={classes.maximized}>
        <NewsFeed operatorPage />
      </Grid>
    )
  }, [classes.maximized])

  return (
    <Grid container className={classes.maximized}>
      <DragDropContext onDragEnd={onDragEnd}>
        {newsFeedPositionLeft && renderNewsFeed}
        <Grid item lg={9} md={9} sm={9} xs={9} style={{ height: '100%' }}>
          {videoWall && <OperatorWall />}
        </Grid>
        {!newsFeedPositionLeft && renderNewsFeed}
      </DragDropContext>
      {isDemo && <DemoPlayback />}
    </Grid>
  )
}
