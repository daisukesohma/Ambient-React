import React, { useState, useMemo } from 'react'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'
import { Icons } from 'ambient_ui'
import { Draggable } from 'react-beautiful-dnd'
import Typography from '@material-ui/core/Typography'
import VideoStreamComponent from 'components/VideoStreamComponent'
import { setStreamCell, clearStreamCell } from 'redux/slices/videoWall'

import getStreamByCell from '../utils/getStreamByCell'
import useEdit from '../../hooks/useEdit'
import VideoWallCellHover from '../VideoWallCellHover'
import disableDropAnimationStyle from '../../../../utils/disableDropAnimationStyle'
import Tooltip from '../../../../components/Tooltip'
import StreamSearch from '../../../../components/StreamSearch'
import LogoAnimated from '../../../../components/LogoAnimated'

import useStyles from './styles'

const propTypes = {
  orderIndex: PropTypes.number,
  streams: PropTypes.array,
  fullscreen: PropTypes.bool,
  closeFullscreen: PropTypes.func,
}

const defaultProps = {
  fullscreen: false,
  closeFullscreen: () => {},
}

function VideoWallCell({ orderIndex, streams, fullscreen, closeFullscreen }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { account } = useParams()
  const activeVideoWall = useSelector(state => state.videoWall.activeVideoWall)
  const currentUserId = useSelector(state => state.auth.user.id)
  const isInternal = useSelector(state => state.auth.user.internal)
  const darkMode = useSelector(state => state.settings.darkMode)

  const isEdit =
    useEdit() &&
    (currentUserId === get(activeVideoWall, 'owner.user.id') || isInternal)

  const [hovered, setHover] = useState(false)

  const classes = useStyles({ isEdit, darkMode, hovered })

  const selectedStream = useMemo(() => {
    const streamCell = getStreamByCell(
      streams,
      activeVideoWall.streamFeeds,
      orderIndex,
    )
    return streamCell && streamCell.streamId !== null
      ? getStreamByCell(streams, activeVideoWall.streamFeeds, orderIndex)
      : null
  }, [streams, activeVideoWall, orderIndex])

  const onChange = (idx, item) => {
    if (item) {
      dispatch(
        setStreamCell({
          orderIndex: idx,
          streamId: item.id,
          stream: item,
        }),
      )
    } else {
      dispatch(clearStreamCell({ orderIndex: idx }))
    }
  }

  const moveIcon = dragging => (
    <Typography style={{ display: hovered || dragging ? null : 'none' }}>
      <Icons.Move stroke={theme.palette.grey[500]} width={24} height={24} />
    </Typography>
  )

  return (
    <Grid
      container
      className={classes.root}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isEdit && (
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          xl={12}
          md={12}
          className={classes.selectBox}
        >
          <StreamSearch
            orderIndex={orderIndex}
            onChangeStream={onChange}
            selectedStream={selectedStream}
          />
        </Grid>
      )}

      {selectedStream && hovered && !isEdit && (
        <VideoWallCellHover
          selectedStream={selectedStream}
          fullscreen={fullscreen}
          closeFullscreen={closeFullscreen}
        />
      )}

      <Grid
        xs={12}
        sm={12}
        lg={12}
        xl={12}
        md={12}
        className={selectedStream ? classes.videoBox : classes.dropBox}
        container
        item
        justify='center'
        alignItems='center'
        alignContent='center'
      >
        {selectedStream && (
          <VideoStreamComponent
            containerStyle={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
            accountSlug={account}
            siteSlug={get(selectedStream, 'siteSlug', null)}
            streamName={get(selectedStream, 'stream.name', null)}
            streamId={get(selectedStream, 'streamId')}
            nodeId={get(selectedStream, 'nodeId')}
            viewMode='JPG'
            willAutoLoad
            key={`video-stream-${orderIndex}-${get(
              selectedStream,
              'streamId',
            )}`}
            showPlaybackControls={false}
            initTS={null}
            streamType='JPG'
            fluid
            isOnVideoWall
            timezone={selectedStream.timezone}
            videoStreamKey={`video-stream-${orderIndex}`}
          />
        )}

        {!selectedStream && isEdit && <div>Drag and drop stream</div>}

        {!selectedStream && !isEdit && (
          <LogoAnimated
            containerStyles={{ marginTop: 0 }}
            logoWidth={54}
            logoEndOpacity={0.5}
            logoTextColor={theme.palette.grey[800]}
            logoTextSize={22}
          />
        )}

        {selectedStream && (
          <Draggable
            key={orderIndex}
            draggableId={`${orderIndex}-${get(selectedStream, 'streamId')}`}
            index={orderIndex}
          >
            {(
              { innerRef, draggableProps, dragHandleProps },
              { isDragging, isDropAnimating },
            ) => (
              <div style={{ position: 'absolute', right: 15, bottom: 10 }}>
                <div
                  ref={innerRef}
                  {...draggableProps}
                  {...dragHandleProps}
                  style={disableDropAnimationStyle(
                    draggableProps.style,
                    isDragging,
                    isDropAnimating,
                  )}
                >
                  <Tooltip content='Drag to Swap Streams'>
                    {moveIcon(isDragging)}
                  </Tooltip>
                </div>
                {isDragging && moveIcon(true)}
              </div>
            )}
          </Draggable>
        )}
      </Grid>
    </Grid>
  )
}

VideoWallCell.propTypes = propTypes
VideoWallCell.defaultProps = defaultProps

export default VideoWallCell
