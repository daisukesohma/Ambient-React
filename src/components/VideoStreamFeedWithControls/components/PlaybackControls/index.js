import React, { useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Icons } from 'ambient_ui'
import ReIdButton from 'components/ReId/components/ReIdButton'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'

import DatePicker from '../DatePickerV2'
import Timeline from '../Timeline'
import PlayPauseButton from '../PlayPauseButton'
import ZoomControl from '../ZoomControl'
import LiveIncidentButton from '../LiveIncidentButton'
import getDatePickerVisibility from '../../../../selectors/videoStreamControls/getDatePickerVisibility'
import getReadableDateTS from '../../../../selectors/videoStreamControls/getReadableDateTS'
import SeekControl from '../SeekControl'
import EntitySelector from '../EntitySelector'
import ArchiveButton from '../ArchiveButton'
import TimelineScroll from '../TimelineScroll'
import DispatchAlert from '../DispatchAlert'
import { setVideoStreamValues } from '../../../../redux/slices/videoStreamControls'
import { Can } from '../../../../rbac'

import 'rc-slider/assets/index.css'
import './index.css'

const { Calendar } = Icons //  ambient_ui icons

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  siteSlug: PropTypes.string.isRequired,
  videoStreamKey: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  streamId: PropTypes.number.isRequired,
  progressBarWidth: PropTypes.number,
  timezone: PropTypes.string,
  initTs: PropTypes.number,
}

const defaultProps = {
  timezone: DEFAULT_TIMEZONE,
  initTs: null,
}

const PlaybackControls = ({
  accountSlug,
  siteSlug,
  videoStreamKey,
  streamId,
  nodeId,
  progressBarWidth,
  timezone,
  initTs,
}) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const isDatePickerVisible = useSelector(
    getDatePickerVisibility({ videoStreamKey }),
  )
  const readableDateTS = useSelector(
    getReadableDateTS({ videoStreamKey, timezone }),
  )

  const toggleDatePicker = useCallback(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          isDatePickerVisible: !isDatePickerVisible,
          showDispatchMenu: false,
        },
      }),
    )
  }, [dispatch, videoStreamKey, isDatePickerVisible])

  return (
    <div
      className='controls playback-controller modal-footer'
      id='video-controls'
    >
      <div className='playback-component-bigger playback-controls-v1 playback-controls-start'>
        {isDatePickerVisible && (
          <DatePicker
            accountSlug={accountSlug}
            videoStreamKey={videoStreamKey}
            siteSlug={siteSlug}
            streamId={streamId}
          />
        )}
        <PlayPauseButton videoStreamKey={videoStreamKey} />
        <div
          className='bottom-button'
          style={{
            marginTop: '0.5em',
            marginBottom: '0.8em',
            marginLeft: '-6px',
          }}
        >
          <button
            id='calendar'
            className='double playback-button'
            type='button'
            onClick={toggleDatePicker}
          >
            <Calendar />
            <div
              className='playback-streamts text-center'
              style={{ marginTop: 3 }}
            >
              {readableDateTS}
            </div>
          </button>
        </div>
        <div className='live-button'>
          <DispatchAlert
            accountSlug={accountSlug}
            siteSlug={siteSlug}
            videoStreamKey={videoStreamKey}
            streamId={streamId}
          />
        </div>
      </div>
      <div
        className='playback-controls-v1 playback-component-progressbar'
        style={{ display: 'none' }}
      >
        <div className='playback-controls-v1 progress progress-container'>
          <div
            className='progress progress-bar'
            style={{ width: `${progressBarWidth}%` }}
          />
        </div>
      </div>
      <div className='playback-controls-v1 playback-component-progressbar'>
        <Timeline videoStreamKey={videoStreamKey} timezone={timezone} />
        <TimelineScroll videoStreamKey={videoStreamKey} timezone={timezone} />
      </div>
      <ZoomControl videoStreamKey={videoStreamKey} />
      <div className='playback-controls-v1 playback-component-bigger playback-controls-end'>
        <div className='live-button'>
          <EntitySelector videoStreamKey={videoStreamKey} />
          <Can I='search_person' on='Live'>
            <div style={{ marginTop: 4 }}>
              <ReIdButton
                color={palette.grey[700]}
                videoStreamKey={videoStreamKey}
              />
            </div>
          </Can>
        </div>
        <LiveIncidentButton
          videoStreamKey={videoStreamKey}
          initTs={initTs}
          timezone={timezone}
        />
        <SeekControl videoStreamKey={videoStreamKey} />
        <div className='live-button'>
          <ArchiveButton
            accountSlug={accountSlug}
            videoStreamKey={videoStreamKey}
            nodeId={nodeId}
            streamId={streamId}
          />
        </div>
      </div>
    </div>
  )
}

PlaybackControls.defaultProps = defaultProps
PlaybackControls.propTypes = propTypes
PlaybackControls.defaultProps = defaultProps

export default PlaybackControls
