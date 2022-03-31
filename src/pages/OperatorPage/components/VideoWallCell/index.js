import React, { useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import { useParams } from 'react-router-dom'
import get from 'lodash/get'
import { useDispatch, useSelector } from 'react-redux'
import { Icons } from 'ambient_ui'
import Typography from '@material-ui/core/Typography'
import { Draggable } from 'react-beautiful-dnd'
// src
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import VideoStreamComponent from 'components/VideoStreamComponent'
import { showModal } from 'redux/slices/modal'
import { ModalTypeEnum } from 'enums'
import Tooltip from 'components/Tooltip'
import disableDropAnimationStyle from 'utils/disableDropAnimationStyle'
import StreamSearch from 'components/StreamSearch'

import useStyles from './styles'

const propTypes = {
  orderIndex: PropTypes.number,
  onChangeStream: PropTypes.func,
  selectedStream: PropTypes.object,
  timezone: PropTypes.string,
}

const VideoWallCell = ({
  orderIndex,
  onChangeStream,
  selectedStream,
  timezone,
}) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const [hovered, setHover] = useState(false)
  const darkMode = useSelector(state => state.settings.darkMode)
  const { account } = useParams()

  const classes = useStyles({ hovered, darkMode, selectedStream })

  const onExpandFeed = () => {
    if (selectedStream) {
      dispatch(
        showModal({
          content: { ...selectedStream, timezone },
          type: ModalTypeEnum.VIDEO,
        }),
      )
    }
  }

  const moveIcon = dragging => (
    <Typography style={{ display: hovered || dragging ? null : 'none' }}>
      <Icons.Move stroke={palette.grey[500]} width={24} height={24} />
    </Typography>
  )

  return (
    <Grid
      container
      className={classes.root}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hovered && (
        <Grid
          item
          xs={12}
          sm={12}
          lg={12}
          xl={12}
          md={12}
          className={classes.topPanelControls}
        >
          <StreamSearch
            orderIndex={orderIndex}
            onChangeStream={onChangeStream}
            selectedStream={selectedStream}
            placeholder={get(selectedStream, 'label', null)}
          />
          <div onClick={onExpandFeed} className={classes.vmsModalIcon}>
            <Icons.Maximize
              style={{
                color:
                  darkMode && selectedStream
                    ? palette.common.white
                    : palette.grey[800],
              }}
              width={24}
              height={24}
              stroke={
                darkMode && selectedStream
                  ? palette.common.white
                  : palette.grey[100]
              }
            />
          </div>
        </Grid>
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
        {selectedStream ? (
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
            key={`video-stream-${orderIndex}`}
            videoStreamKey={`video-stream-${orderIndex}`}
            showPlaybackControls={false}
            initTS={null}
            streamType='JPG'
            fluid
            isOnVideoWall
            timezone={timezone}
          />
        ) : (
          <div>Drag and drop stream</div>
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
VideoWallCell.defaultProps = {
  timezone: DEFAULT_TIMEZONE,
}

export default VideoWallCell
