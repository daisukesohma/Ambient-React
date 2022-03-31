import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { connect } from 'react-redux'

import Tooltip from '../../../Tooltip'
import { PlaybackStatusEnum } from '../../../../enums'
import DatePicker from '../DatePicker'
import { getCurrUnixTimestamp } from '../../utils'
import {
  VmsPropType,
  VmsPropTypeDefault,
} from '../../../../common/data/proptypes/redux'
import { setTimelineSettingPosition as setTimelineSettingPositionAction } from '../../../../redux/vms/actions'

import ArchiveSaveButton from './ArchiveSaveButton'
import CustomAlertButton from './CustomAlertButton'
import DateDisplay from './DateDisplay'
import FullScreenButton from './FullScreenButton'
import PlayControls from './PlayControls' // future: @eric under ControlBar
import PlayheadViewer from './PlayheadViewer'
import SeekToTimeButton from './SeekToTimeButton'
import SettingsButton from './SettingsButton'
import SettingsMenu from './SettingsMenu'
import StatusButton from './StatusButton' // future: @eric under ControlBar
import TimeDisplay from './TimeDisplay'
import TimelineContainer from './TimelineContainer'
import ZoomLevelControl from './ZoomLevelControl'
import './index.css'

const PlaybackControls = props => {
  const {
    darkMode,
    isFullScreenVideo,
    isFollowing,
    handleEnterFullScreenVideo,
    handleExitFullScreenVideo,
    playbackStatus,
    setTimelineSettingPosition,
    shouldDefinitelyResetPlayheadInRange, // hack!
    setShouldDefinitelyResetPlayheadInRange, // so hacky, but necessary
    toggleDarkMode,
    vms,
  } = props
  const { position } = vms.timeline.settings
  const [viewableStartTS, setViewableStartTS] = useState(0)
  const [viewableEndTS, setViewableEndTS] = useState(0)
  const [isHoveringOnTopControls, setIsHoveringOnTopControls] = useState(false)
  const [isPlayheadInRange, setIsPlayheadInRange] = useState(true)
  const [shouldResetPlayheadInRange, setShouldResetPlayheadInRange] = useState(
    false,
  ) // boolean that wiill tell timeline to run a function
  const [playheadFixedPosition, setPlayheadFixedPosition] = useState('right')
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)

  const containerClass = clsx(
    'controls',
    'vms-playback-controller',
    'modal-footer',
    { darkMode },
  )

  // @Future: factor this logic out when VideoStreamV2 is functional component
  // tldr; this is necessary to call function from child functional component from parent class component
  //
  useEffect(() => {
    setShouldResetPlayheadInRange(shouldDefinitelyResetPlayheadInRange)
    setShouldDefinitelyResetPlayheadInRange(false) // turn off flag in parent
  }, [
    shouldDefinitelyResetPlayheadInRange,
    setShouldDefinitelyResetPlayheadInRange,
  ])

  const isDarkMode = darkMode || position === 'overlay'
  let isLiveDisabled
  // let stepForwardDisabled

  let liveButtonFunction = props.handleGoLiveButton

  if (playbackStatus === PlaybackStatusEnum.LIVE) {
    if (props.initTS) {
      isLiveDisabled = false
      liveButtonFunction = props.jumpToInitTS
    } else {
      isLiveDisabled = true
      // stepForwardDisabled = true;
    }
    // show go to incident
    // else show Live button
  } else if (playbackStatus === PlaybackStatusEnum.PLAYING) {
    isLiveDisabled = false
    // stepForwardDisabled = false;
    if (props.initTS) {
      liveButtonFunction = props.handleGoLiveButton
    }
  } else if (playbackStatus === PlaybackStatusEnum.PAUSED) {
    isLiveDisabled = false
    // stepForwardDisabled = false;
  }

  const toggleTimelinePosition = () => {
    let newPosition
    if (position === 'overlay') {
      newPosition = 'below'
    } else {
      newPosition = 'overlay'
    }
    setTimelineSettingPosition(newPosition)
  }

  return (
    <div className={containerClass} id='video-controls'>
      <div className='playback-controls playback-component-progressbar vms-timeline-container'>
        <TimelineContainer
          {...props}
          handleViewableStartTS={ts => setViewableStartTS(ts)}
          handleViewableEndTS={ts => setViewableEndTS(ts)}
          isHoveringOnTopControls={isHoveringOnTopControls}
          setIsPlayheadInRange={setIsPlayheadInRange}
          shouldResetPlayheadInRange={shouldResetPlayheadInRange}
          setShouldResetPlayheadInRange={setShouldResetPlayheadInRange}
          playheadFixedPosition={playheadFixedPosition}
          setPlayheadFixedPosition={setPlayheadFixedPosition}
        />
        <DatePicker
          isVisible={props.isDatePickerVisible}
          toggleDatePicker={props.toggleDatePicker}
          videoStreamTS={props.videoStreamTS}
          handleDatePickerSelection={props.handleDatePickerSelection}
          daysBackAccessible={props.daysBackAccessible}
          subtractDays={props.subtractDays}
          daysWithData={props.daysWithData}
          datePickerSelectionTS={props.datePickerSelectionTS} // FUTURE: @eric CURRENT DAY to be used later
        />
        <div
          id='top-control-container'
          style={styles.topControlContainer}
          onMouseEnter={() => setIsHoveringOnTopControls(true)}
          onMouseLeave={() => setIsHoveringOnTopControls(false)}
        >
          <div style={styles.topControlItemLeft}>
            <Tooltip
              content={
                playbackStatus === PlaybackStatusEnum.LIVE
                  ? 'Currently playing live'
                  : 'Skip ahead to live stream.'
              }
            >
              <div>
                <StatusButton
                  darkMode={isDarkMode}
                  playbackStatus={playbackStatus}
                  initTS={props.initTS}
                  liveButtonFunction={liveButtonFunction}
                  isLiveDisabled={isLiveDisabled}
                />
              </div>
            </Tooltip>
            <div>
              <Tooltip
                content={
                  isPlayheadInRange ? 'Playhead visible' : 'Go to Playhead'
                }
              >
                <div>
                  <PlayheadViewer
                    isPlayheadInRange={isPlayheadInRange}
                    setShouldResetPlayheadInRange={
                      setShouldResetPlayheadInRange
                    }
                  />
                </div>
              </Tooltip>
            </div>
          </div>
          <div style={styles.topControlItem}>
            <PlayControls
              darkMode={isDarkMode}
              playbackStatus={playbackStatus}
              handlePlayPauseButton={props.handlePlayPauseButton}
              handleStepInSeconds={props.handleStepInSeconds}
            />
          </div>
          <div style={styles.topControlItemRight}>
            <span style={{ marginRight: 20 }}>
              <ZoomLevelControl
                darkMode={isDarkMode}
                zoomLevel={props.zoomLevel}
                setZoomLevel={props.setZoomLevel}
              />
            </span>
            <FullScreenButton
              isFullScreenVideo={isFullScreenVideo}
              handleEnter={handleEnterFullScreenVideo}
              handleExit={handleExitFullScreenVideo}
            />
          </div>
        </div>
        <div
          id='bottom-control-bar'
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '0 10px',
            minWidth: 350,
            maxWidth: '100%',
            background: darkMode
              ? 'rgba(255,255,255,0.15)'
              : 'rgba(0,0,0,.015)',
            height: 60,
            borderRadius: 10,
          }}
        >
          <div style={styles.container}>
            <div>
              <TimeDisplay
                darkMode={darkMode}
                dayStartTS={viewableStartTS}
                dayEndTS={viewableEndTS}
                playbackStatus={playbackStatus}
                videoStreamTS={props.videoStreamTS}
                zoomLevel={props.zoomLevel}
                isToday={props.subtractDays === 0}
              />
            </div>
            <Tooltip content='Seek to time'>
              <div onClick={props.toggleSeekTime} style={{ marginRight: 10 }}>
                <SeekToTimeButton darkMode={darkMode} />
              </div>
            </Tooltip>
            <Tooltip content='Select date'>
              <div>
                <DateDisplay
                  darkMode={darkMode}
                  toggleDatePicker={props.toggleDatePicker}
                  datePickerSelectionTS={props.datePickerSelectionTS}
                />
              </div>
            </Tooltip>
          </div>
          <div style={styles.container}>
            <Tooltip content='Create custom alert'>
              <div>
                <CustomAlertButton
                  darkMode={darkMode}
                  handleClick={props.toggleDispatchMenu}
                />
              </div>
            </Tooltip>
            <Tooltip content='Save clip to archive'>
              <div>
                <ArchiveSaveButton toggleExportMode={props.toggleExportMode} />
              </div>
            </Tooltip>
            <Tooltip content='Settings'>
              <div
                className='ignore-react-onclickoutside' // allow this click to work
                onClick={() => {
                  setIsSettingsVisible(!isSettingsVisible)
                }}
              >
                <SettingsButton darkMode={darkMode} />
              </div>
            </Tooltip>
          </div>
          {isSettingsVisible && (
            <div
              style={{
                position: 'absolute',
                bottom: position === 'below' ? 170 : 125,
                right: 5,
              }}
            >
              <SettingsMenu
                isFullScreenVideo={isFullScreenVideo}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                isLocked={isFollowing}
                isPlayheadInRange={isPlayheadInRange}
                playheadFixedPosition={playheadFixedPosition}
                setPlayheadFixedPosition={setPlayheadFixedPosition}
                setIsSettingsVisible={setIsSettingsVisible}
                toggleTimelinePosition={toggleTimelinePosition}
                timelineSettingPosition={position}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

let styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topControlContainer: {
    display: 'flex',
    marginTop: -8, // pull top controls closer to timeline
    paddingBottom: 8, // push bottom controls back down
  },
  topControlItem: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topControlItemLeft: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topControlItemRight: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}

PlaybackControls.defaultProps = {
  catalogue: [],
  changeExportTSRange: () => {},
  createDispatchRequest: () => {},
  creatingDispatchRequest: false,
  darkMode: false,
  dataFromTS: () => {},
  datePickerSelectionTS: null,
  daysBackAccessible: 31,
  daysWithData: [],
  displayEntitySelector: false,
  displayMessage: false, // Loading Timeline
  endTimelineTS: getCurrUnixTimestamp(),
  entitySelectorOptions: [],
  exportEndTS: null,
  exportStartTS: null,
  handleDatePickerSelection: () => {},
  handleEnterFullScreenVideo: () => {},
  handleEntitySelection: () => {},
  handleExitFullScreenVideo: () => {},
  handleExport: () => {},
  handleGoLiveButton: () => {},
  handlePlayPauseButton: () => {},
  handleStepInSeconds: () => {},
  initTS: null,
  isAlertsVisible: true,
  isArchiveVisible: false,
  isDatePickerVisible: false,
  isFollowing: true,
  isFullScreenVideo: false,
  isHoveringOnTimeline: false,
  isCatalogueMissing: false,
  isSeekTimeVisible: false,
  isTSWithinRetentionDays: () => {},
  isZoomIn: 1,
  jumpToInitTS: () => {},
  loadingArchivalVideo: true,
  message: '', // Loading Timeline Before Displaying
  metadata: [],
  onTimelineHover: () => {},
  onTimelineSelection: () => {},
  playbackStatus: PlaybackStatusEnum.LIVE,
  readableDate: '',
  readableTSPlaying: '',
  retention: {},
  selectedEntities: [],
  sendTooltipMessage: () => {},
  setInitTS: false,
  setShouldDefinitelyResetPlayheadInRange: () => {},
  setTimelineSettingPosition: () => {},
  setZoomLevel: () => {},
  shouldDefinitelyResetPlayheadInRange: false,
  showDispatchMenu: false,
  startTimelineTS: Math.round(new Date().setHours(0, 0, 0, 0) / 1000),
  stopVideoElem: () => {},
  streamId: null,
  subtractDays: 0, // days from today aka 0 = today
  toggleDarkMode: () => {},
  toggleDatePicker: () => {},
  toggleDispatchMenu: () => {},
  toggleEntitySelectorDisplay: () => {},
  toggleExportMode: () => {},
  toggleSeekTime: () => {},
  toggleSetInitTS: () => {},
  videoStreamTS: getCurrUnixTimestamp(),
  vms: VmsPropTypeDefault,
  zoomLevel: 5,
}

PlaybackControls.propTypes = {
  catalogue: PropTypes.array,
  changeExportTSRange: PropTypes.func,
  createDispatchRequest: PropTypes.func,
  creatingDispatchRequest: PropTypes.bool,
  darkMode: PropTypes.bool,
  dataFromTS: PropTypes.func,
  datePickerSelectionTS: PropTypes.number,
  daysBackAccessible: PropTypes.number,
  daysWithData: PropTypes.array,
  displayEntitySelector: PropTypes.bool,
  displayMessage: PropTypes.bool, // Loading Timeline
  endTimelineTS: PropTypes.number,
  entitySelectorOptions: PropTypes.array,
  exportEndTS: PropTypes.number,
  exportStartTS: PropTypes.number,
  handleDatePickerSelection: PropTypes.func,
  handleEnterFullScreenVideo: PropTypes.func,
  handleEntitySelection: PropTypes.func,
  handleExitFullScreenVideo: PropTypes.func,
  handleExport: PropTypes.func,
  handleGoLiveButton: PropTypes.func,
  handlePlayPauseButton: PropTypes.func,
  handleStepInSeconds: PropTypes.func,
  initTS: PropTypes.number,
  isAlertsVisible: PropTypes.bool,
  isArchiveVisible: PropTypes.bool,
  isDatePickerVisible: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isFullScreenVideo: PropTypes.bool,
  isHoveringOnTimeline: PropTypes.bool,
  isSeekTimeVisible: PropTypes.bool,
  isTSWithinRetentionDays: PropTypes.func,
  isZoomIn: PropTypes.number,
  isCatalogueMissing: PropTypes.bool,
  jumpToInitTS: PropTypes.func,
  loadingArchivalVideo: PropTypes.bool,
  message: PropTypes.string, // Loading Timeline Before Displaying
  metadata: PropTypes.array,
  onTimelineHover: PropTypes.func,
  onTimelineSelection: PropTypes.func,
  playbackStatus: PropTypes.string,
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
  setTimelineSettingPosition: PropTypes.func,
  setZoomLevel: PropTypes.func,
  shouldDefinitelyResetPlayheadInRange: PropTypes.bool,
  showDispatchMenu: PropTypes.bool,
  startTimelineTS: PropTypes.number,
  stopVideoElem: PropTypes.func,
  streamId: PropTypes.number,
  subtractDays: PropTypes.number, // days from today aka 0 = today
  toggleDarkMode: PropTypes.func,
  toggleDatePicker: PropTypes.func,
  toggleDispatchMenu: PropTypes.func,
  toggleEntitySelectorDisplay: PropTypes.func,
  toggleExportMode: PropTypes.func,
  toggleSeekTime: PropTypes.func,
  toggleSetInitTS: PropTypes.func,
  videoStreamTS: PropTypes.number,
  vms: VmsPropType,
  zoomLevel: PropTypes.number,
}

const mapStateToProps = state => ({
  vms: state.vms,
})

const mapDispatchToProps = dispatch => ({
  setTimelineSettingPosition: data =>
    dispatch(setTimelineSettingPositionAction(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaybackControls)
