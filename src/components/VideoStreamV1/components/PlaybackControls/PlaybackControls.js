import React from 'react'
import Slider from 'rc-slider'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Icons } from 'ambient_ui'
import { Icon } from 'react-icons-kit'
import { bell } from 'react-icons-kit/fa/bell'
import { pause } from 'react-icons-kit/fa/pause'
import { search } from 'react-icons-kit/fa/search'
import { play } from 'react-icons-kit/fa/play'
import { circle } from 'react-icons-kit/fa/circle'
import { history } from 'react-icons-kit/fa/history'
import { cloudUpload } from 'react-icons-kit/fa/cloudUpload'
import { close } from 'react-icons-kit/fa/close'
import clsx from 'clsx'

import PlaybackStatus from '../../data/PlaybackStatus'
import DatePicker from '../DatePicker/DatePicker'
import DispatchMenu from '../DispatchMenu/DispatchMenu'
import Timeline from '../Timeline/Timeline'
import getCurrUnixTimestamp from '../../utils/getCurrUnixTimestamp'
import Tooltip from '../../../Tooltip'
import TooltipText from '../../../Tooltip/TooltipText'

import 'rc-slider/assets/index.css'
import './PlaybackControls.css'

const { Calendar } = Icons //  ambient_ui icons

const PlaybackControls = ({
  catalogue,
  changeExportTSRange,
  createDispatchRequest,
  creatingDispatchRequest,
  dataFromTS,
  daysBackAccessible,
  daysWithData,
  displayEntitySelector,
  displayMessage,
  endTimelineTS,
  entitiesOnly,
  entitySelectorOptions,
  exportMode,
  handleDatePickerSelection,
  handleEntitySelection,
  handleExport,
  handleExportMode,
  handleGoLiveButton,
  handlePlayPauseButton,
  handleZoom,
  initTS,
  isDatePickerVisible,
  isFollowing,
  isHoveringOnTimeline,
  isTSWithinRetentionDays,
  isZoomIn,
  jumpToInitTS,
  loadingArchivalVideo,
  message,
  metadata,
  noLongerFollowing,
  onTimelineHover,
  onTimelineLeave,
  onTimelineSelection,
  playbackStatus,
  progressBarWidth,
  readableDate,
  readableTSPlaying,
  retention,
  selectedEntities,
  sendTooltipMessage,
  setInitTS,
  showDispatchMenu,
  showSeekInputDisplay,
  startTimelineTS,
  stopVideoElem,
  streamId,
  subtractDays,
  thumbnailDate,
  toggleDatePicker,
  toggleDispatchMenu,
  toggleEntitiesOnly,
  toggleEntitySelectorDisplay,
  toggleSeekInputDisplay,
  toggleSetInitTS,
  videoStreamTS,
  viewWindowIncrementSize,
  tsTimelineHighlight,
}) => {
  const { palette } = useTheme()
  let playPauseIcon
  let liveIconColor
  let liveDisabled
  // let stepForwardDisabled

  let liveButtonText = 'Live'

  let liveButtonFunction = handleGoLiveButton

  if (playbackStatus === PlaybackStatus.LIVE) {
    // If there is an initTS
    if (initTS) {
      liveDisabled = false
      liveButtonText = 'Incident'
      liveButtonFunction = jumpToInitTS
    } else {
      liveDisabled = true
      // stepForwardDisabled = true;
    }
    playPauseIcon = 'pause'
    liveIconColor = palette.error.main
    // show go to incident
    // else show Live button
  } else if (playbackStatus === PlaybackStatus.PLAYING) {
    playPauseIcon = 'pause'
    liveIconColor = null
    liveDisabled = false
    // stepForwardDisabled = false;
    if (initTS) {
      liveIconColor = palette.error.main
      liveButtonFunction = handleGoLiveButton
    }
  } else if (playbackStatus === PlaybackStatus.PAUSED) {
    playPauseIcon = 'play'
    liveIconColor = null
    liveDisabled = false
    // stepForwardDisabled = false;
  }
  const displayDatePicker = (
    <DatePicker
      daysBackAccessible={daysBackAccessible}
      daysWithData={daysWithData}
      handleDatePickerSelection={handleDatePickerSelection}
      subtractDays={subtractDays}
      toggleDatePicker={toggleDatePicker}
      videoStreamTS={videoStreamTS}
    />
  )

  const entityToggleButtonText = displayEntitySelector ? 'Hide' : 'Entities'
  const seekToggleButtonText = showSeekInputDisplay ? 'Hide' : 'Seek'

  const displayDispatchMenu = showDispatchMenu ? (
    <DispatchMenu
      createDispatchRequest={createDispatchRequest}
      creatingDispatchRequest={creatingDispatchRequest}
      videoStreamTS={videoStreamTS}
    />
  ) : null

  return (
    <div
      className='controls playback-controller modal-footer'
      id='video-controls'
      style={{
        width: '100%',
      }}
    >
      <div className='playback-component-bigger playback-controls-v1 playback-controls-start'>
        {isDatePickerVisible && displayDatePicker}
        {displayDispatchMenu}
        <div className='play-pause'>
          <button
            id='play-pause'
            className='playback-button'
            type='button'
            data-state='play'
            onClick={handlePlayPauseButton}
          >
            <span style={{ color: palette.grey[600], paddingRight: 5 }}>
              {playPauseIcon === 'play' ? (
                <Icon icon={play} />
              ) : (
                <Icon icon={pause} />
              )}
            </span>
          </button>
        </div>
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
              style={{ marginTop: '3px' }}
            >
              {readableDate}
            </div>
          </button>
        </div>
        <div className='live-button'>
          <button
            id='live'
            style={{ display: 'flex' }}
            className='playback-button playback-live-indicator'
            type='button'
            onClick={toggleDispatchMenu}
          >
            <span style={{ color: palette.error.main, paddingRight: 5 }}>
              {showDispatchMenu ? <Icon icon={close} /> : <Icon icon={bell} />}
            </span>
          </button>
        </div>
      </div>
      <div
        className='playback-controls-v1 playback-component-progressbar'
        style={{ display: 'none' }}
      >
        <div
          className='playback-controls-v1 progress progress-container'
          onMouseUp={onTimelineSelection}
          onMouseMove={onTimelineHover}
          onMouseLeave={onTimelineLeave}
        >
          <div
            className='progress progress-bar'
            style={{ width: `${progressBarWidth}%` }}
            value={videoStreamTS}
            min='0'
          />
        </div>
      </div>
      <div className='playback-controls-v1 playback-component-progressbar'>
        <Timeline
          catalogue={catalogue}
          changeExportTSRange={changeExportTSRange}
          dataFromTS={dataFromTS}
          displayEntitySelector={displayEntitySelector}
          displayMessage={displayMessage}
          endTimelineTS={endTimelineTS}
          entitiesOnly={entitiesOnly}
          entitySelectorOptions={entitySelectorOptions}
          exportMode={exportMode}
          handleEntitySelection={handleEntitySelection}
          initTS={initTS}
          isFollowing={isFollowing}
          isHoveringOnTimeline={isHoveringOnTimeline}
          isTSWithinRetentionDays={isTSWithinRetentionDays}
          isZoomIn={isZoomIn}
          loadingArchivalVideo={loadingArchivalVideo}
          message={message}
          metadata={metadata}
          noLongerFollowing={noLongerFollowing}
          onTimelineHover={onTimelineHover}
          onTimelineLeave={onTimelineLeave}
          onTimelineSelection={onTimelineSelection}
          playbackStatus={playbackStatus}
          readableTSPlaying={readableTSPlaying}
          retention={retention}
          selectedEntities={selectedEntities}
          sendTooltipMessage={sendTooltipMessage}
          setInitTS={setInitTS}
          showSeekInputDisplay={showSeekInputDisplay}
          startTimelineTS={startTimelineTS}
          stopVideoElem={stopVideoElem}
          streamId={streamId}
          subtractDays={subtractDays}
          thumbnailDate={thumbnailDate}
          toggleEntitiesOnly={toggleEntitiesOnly}
          toggleSetInitTS={toggleSetInitTS}
          videoStreamTS={videoStreamTS}
          viewWindowIncrementSize={viewWindowIncrementSize}
          tsTimelineHighlight={tsTimelineHighlight}
        />
      </div>
      <div className='zoom-controls'>
        <Slider
          vertical
          style={{ marginTop: '-0.5em', height: '40%' }}
          marks={{
            0: {
              label: 'Hrs',
              style: {
                marginLeft: '-2.5em',
                fontSize: '0.7em',
                marginBottom: '-140%',
              },
            },
            1: {
              label: 'Mins',
              style: {
                marginLeft: '-2.5em',
                fontSize: '0.7em',
                marginBottom: '40%',
              },
            },
          }}
          step={1}
          min={0}
          max={1}
          defaultValue={0}
          value={isZoomIn}
          onChange={handleZoom}
        />
      </div>
      <div className='playback-controls-v1 playback-component-bigger playback-controls-end'>
        <div className='live-button'>
          <button
            id='entity-display'
            style={{ display: 'flex' }}
            className='playback-button playback-live-indicator'
            type='button'
            onClick={toggleEntitySelectorDisplay}
          >
            <span style={{ color: palette.primary[300], paddingRight: 4 }}>
              <Icon icon={search} />
            </span>
            <span className={clsx('am-caption', 'buttonText')}>
              {entityToggleButtonText}
            </span>
          </button>
        </div>
        <div className='live-button'>
          <button
            id='live'
            style={{ display: 'flex' }}
            className='playback-button playback-live-indicator'
            type='button'
            onClick={liveButtonFunction}
            disabled={liveDisabled}
          >
            <span style={{ color: liveIconColor, paddingRight: 5 }}>
              <Icon icon={circle} />
            </span>
            <span
              id='live-button-text'
              className={clsx('am-caption', 'buttonText')}
            >
              {liveButtonText}
            </span>
          </button>
        </div>
        <div className='live-button'>
          <button
            id='live'
            style={{ display: 'flex' }}
            className='playback-button playback-live-indicator'
            type='button'
            onClick={toggleSeekInputDisplay}
          >
            <span style={{ color: palette.grey[600], paddingRight: 5 }}>
              <Icon icon={history} />
            </span>
            <span className={clsx('am-caption', 'buttonText')}>
              {seekToggleButtonText}
            </span>
          </button>
        </div>
        <div className='live-button'>
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
        </div>
      </div>
    </div>
  )
}

PlaybackControls.defaultProps = {
  catalogue: [],
  changeExportTSRange: () => {},
  createDispatchRequest: () => {},
  creatingDispatchRequest: false,
  dataFromTS: () => {},
  daysBackAccessible: 31,
  daysWithData: [],
  displayEntitySelector: false,
  displayMessage: false, // Loading Timeline
  endTimelineTS: getCurrUnixTimestamp(),
  entitiesOnly: false,
  entitySelectorOptions: [],
  exportMode: false,
  handleDatePickerSelection: () => {},
  handleEntitySelection: () => {},
  handleExport: () => {},
  handleExportMode: () => {},
  handleGoLiveButton: () => {},
  handlePlayPauseButton: () => {},
  handleZoom: () => {},
  initTS: null,
  isDatePickerVisible: false,
  isFollowing: false,
  isHoveringOnTimeline: false,
  isTSWithinRetentionDays: () => {},
  isZoomIn: 0,
  jumpToInitTS: () => {},
  loadingArchivalVideo: true,
  message: '', // Loading Timeline Before Displaying
  metadata: [],
  noLongerFollowing: () => {},
  onTimelineHover: () => {},
  onTimelineLeave: () => {},
  onTimelineSelection: () => {},
  playbackStatus: PlaybackStatus.LIVE,
  progressBarWidth: 100,
  readableDate: '',
  readableTSPlaying: '',
  retention: {},
  selectedEntities: [],
  sendTooltipMessage: () => {},
  setInitTS: false,
  setShouldDefinitelyResetPlayheadInRange: () => {},
  shouldDefinitelyResetPlayheadInRange: false,
  showDispatchMenu: false,
  showSeekInputDisplay: false,
  startTimelineTS: Math.round(new Date().setHours(0, 0, 0, 0) / 1000),
  stopVideoElem: () => {},
  streamId: null,
  subtractDays: 0, // days from today aka 0 = today
  thumbnailDate: '',
  toggleDatePicker: () => {},
  toggleDispatchMenu: () => {},
  toggleEntitiesOnly: () => {},
  toggleEntitySelectorDisplay: () => {},
  toggleSeekInputDisplay: () => {},
  toggleSetInitTS: () => {},
  videoStreamTS: getCurrUnixTimestamp(),
  viewWindowIncrementSize: 10,
  tsTimelineHighlight: PropTypes.number,
}

PlaybackControls.propTypes = {
  catalogue: PropTypes.array,
  changeExportTSRange: PropTypes.func,
  createDispatchRequest: PropTypes.func,
  creatingDispatchRequest: PropTypes.bool,
  dataFromTS: PropTypes.func,
  daysBackAccessible: PropTypes.number,
  daysWithData: PropTypes.array,
  displayEntitySelector: PropTypes.bool,
  displayMessage: PropTypes.bool, // Loading Timeline
  endTimelineTS: PropTypes.number,
  entitiesOnly: PropTypes.bool,
  entitySelectorOptions: PropTypes.array,
  exportMode: PropTypes.bool,
  handleDatePickerSelection: PropTypes.func,
  handleEntitySelection: PropTypes.func,
  handleExport: PropTypes.func,
  handleExportMode: PropTypes.func,
  handleGoLiveButton: PropTypes.func,
  handlePlayPauseButton: PropTypes.func,
  handleZoom: PropTypes.func,
  initTS: PropTypes.number,
  isDatePickerVisible: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isHoveringOnTimeline: PropTypes.bool,
  isTSWithinRetentionDays: PropTypes.func,
  isZoomIn: PropTypes.number,
  jumpToInitTS: PropTypes.func,
  loadingArchivalVideo: PropTypes.bool,
  message: PropTypes.string, // Loading Timeline Before Displaying
  metadata: PropTypes.array,
  noLongerFollowing: PropTypes.func,
  onTimelineHover: PropTypes.func,
  onTimelineLeave: PropTypes.func,
  onTimelineSelection: PropTypes.func,
  playbackStatus: PropTypes.string,
  progressBarWidth: PropTypes.number,
  readableDate: PropTypes.string,
  readableTSPlaying: PropTypes.string,
  retention: PropTypes.shape({
    motion_segment_retention_days: PropTypes.number,
    nonmotion_segment_retention_days: PropTypes.number,
  }),
  selectedEntities: PropTypes.array,
  sendTooltipMessage: PropTypes.func,
  setInitTS: PropTypes.bool,
  setShouldDefinitelyResetPlayheadInRange: PropTypes.func,
  shouldDefinitelyResetPlayheadInRange: PropTypes.bool,
  showDispatchMenu: PropTypes.bool,
  showSeekInputDisplay: PropTypes.bool,
  startTimelineTS: PropTypes.number,
  stopVideoElem: PropTypes.func,
  streamId: PropTypes.number,
  subtractDays: PropTypes.number, // days from today aka 0 = today
  thumbnailDate: PropTypes.string,
  toggleDatePicker: PropTypes.func,
  toggleDispatchMenu: PropTypes.func,
  toggleEntitiesOnly: PropTypes.func,
  toggleEntitySelectorDisplay: PropTypes.func,
  toggleSeekInputDisplay: PropTypes.func,
  toggleSetInitTS: PropTypes.func,
  videoStreamTS: PropTypes.number,
  viewWindowIncrementSize: PropTypes.number,
  tsTimelineHighlight: PropTypes.number,
}

export default PlaybackControls
