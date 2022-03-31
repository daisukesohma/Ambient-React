import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { cloudUpload } from 'react-icons-kit/fa/cloudUpload'
import { Icon } from 'react-icons-kit'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { setVideoStreamValues } from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import { useExportStream } from 'webrtc/hooks'

import Tooltip from '../../../Tooltip'
import TooltipText from '../../../Tooltip/TooltipText'
import { msToUnix } from 'utils'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  videoStreamKey: PropTypes.string.isRequired,
  nodeId: PropTypes.string,
  streamId: PropTypes.number.isRequired,
}

const defaultProps = {
  nodeId: '',
}

const ArchiveButton = ({ accountSlug, videoStreamKey, nodeId, streamId }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()

  const exportMode = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'exportMode' }),
  )

  const exportStartTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'exportStartTS' }),
  )

  const exportEndTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'exportEndTS' }),
  )
  const oldTrackId = useSelector(
    getStreamFeedData({ videoStreamKey, property: 'oldTrackId' }),
  )
  const requestExport = useExportStream()

  const sendTooltipMessage = useCallback(
    (message, time) => {
      const newTime = time || 5000
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            message,
            displayMessage: true,
          },
        }),
      )

      setTimeout(() => {
        dispatch(
          setVideoStreamValues({
            videoStreamKey,
            props: {
              message: '',
              displayMessage: false,
            },
          }),
        )
      }, newTime)
    },
    [dispatch, videoStreamKey],
  )

  const handleExportMode = useCallback(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          exportMode: !exportMode,
        },
      }),
    )
  }, [dispatch, videoStreamKey, exportMode])

  const handleExport = useCallback(() => {
    let tip
    // Check if catalogue data exists
    if (exportStartTS !== null && exportEndTS !== null) {
      const currTS = msToUnix(Date.now())
      if (exportStartTS <= currTS || exportEndTS <= currTS) {
        tip = (
          <span>
            Your recording is being saved. It will be available for viewing at
            the{' '}
            <a
              style={{ color: 'white' }}
              href={`/accounts/${accountSlug}/history/archives`}
            >
              archives page.
            </a>
          </span>
        )
        // some fetch request
        // Used for creation of video export file name. Adding both stream id and start and end ts.
        requestExport({
          nodeId,
          videoStreamKey,
          streamId,
          oldTrackId,
          startTs: exportStartTS * 1000,
          endTs: exportEndTS * 1000,
        })
        handleExportMode()
      } else {
        tip = <span>The desired time range has yet to occur.</span>
      }
    } else {
      tip = (
        <span>
          Please indicate the start and end time of the clip you would like to
          extract by dragging both the Clip Selector handles on the Timeline.
        </span>
      )
    }

    sendTooltipMessage(tip, 5000)
  }, [
    accountSlug,
    exportEndTS,
    exportStartTS,
    handleExportMode,
    nodeId,
    sendTooltipMessage,
    streamId,
    oldTrackId,
    requestExport,
    videoStreamKey,
  ])

  return (
    <Tooltip
      content={
        <div className='export-controls'>
          <button
            id='cancel'
            onClick={handleExportMode}
            className='playback-button'
            type='button'
          >
            <TooltipText>Cancel</TooltipText>
          </button>
          <button
            id='save'
            onClick={handleExport}
            className='playback-button'
            type='button'
          >
            <TooltipText>Save</TooltipText>
          </button>
        </div>
      }
      interactive
      visible={exportMode}
      placement='bottom'
    >
      <button
        id='export'
        style={{ display: 'flex' }}
        onClick={handleExportMode}
        className='playback-button playback-live-indicator'
        type='button'
      >
        <span style={{ color: palette.grey[600], paddingRight: 5 }}>
          <Icon icon={cloudUpload} />
        </span>
        <span className={clsx('am-caption', 'buttonText')}>Archive</span>
      </button>
    </Tooltip>
  )
}

ArchiveButton.propTypes = propTypes
ArchiveButton.defaultProps = defaultProps

export default ArchiveButton
