/* eslint-disable no-prototype-builtins, no-console, import/no-named-as-default-member */
/*
   This is the react component which enables Live Streaming
   It can be imported into another react application or called as a method (see index.js)
   author: rodaan@ambient.ai

   How to Use:

      <VideoStream
        accountSlug={accountSlug}
        siteSlug={siteSlug}
        streamId={streamId}
        nodeId={nodeId}
        previewFreq={previewFreq} --> Determines how quickly to pull the preview frame of a stream
        debugMode={false} --> increases speed of preview frame
        streamType={streamType} --> Sets if you want SPE or regular stream ['JPG' or 'SPE'] --> Use the StreamTypeEnum
        autoReconnectAttempts={false} --> Determines if the stream should try to autoconnect [true or false]
        reconnectTimeoutMs={false}
        willAutoLoad={willAutoLoad} --> Will start the video play on load [true or false]
        key={makeUniqueId()} --> Lets react differential it from other similar components
        showPlaybackControls={showPlaybackControls} --> Shows playback controls [true or false]
        initTS={startTS} --> Sets an initTS to start stream at [unixTS in secs]
      />,
*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { Icon } from 'react-icons-kit'
import { alertTriangle } from 'react-icons-kit/feather/alertTriangle'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'
import { isMobile, withOrientationChange } from 'react-device-detect'
import { SizeMe } from 'react-sizeme'
import get from 'lodash/get'

import { Icons } from 'ambient_ui'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'
import vmsActions from '../../redux/vms/actions'
import { makeUniqueId, api, getHost } from 'utils'
import {
  subscribe as subscribeAction,
  unsubscribe as unsubscribeAction,
  requestIceServers as requestIceServersAction,
  requestCandidates as requestCandidatesAction,
  sendCandidate as sendCandidateAction,
  sendOffer as sendOfferAction,
  sendExportRequest as sendExportRequestAction,
  updateArchivalPlayTime as updateArchivalPlayTimeAction,
  hangup as hangupAction,
} from '../../redux/signal/actions'
import {
  PlaybackStatusEnum,
  StreamTypeEnum,
  VideoIconControlEffectEnum,
  DataChannelCodeEnum,
} from '../../enums'
import { VmsPropType, VmsPropTypeDefault } from '../../common/data/proptypes'
import IndicatorStatusBadge from '../IndicatorStatusBadge'

import mockCatalog from './data/mockCatalog'
import mockEntities from './data/mockEntities'
import PreviewFrequency from './data/PreviewFrequency'
import EntityNavigator from './components/EntityNavigator'
import EntitySearch from './components/EntitySearch'
import IndicatorState from './data/IndicatorState'
import LiveStreamComponentState from './data/LiveStreamComponentState'
import EntitySubSelectionTree from './data/EntitySubSelectionTree'
import PlaybackControls from './components/PlaybackControls'
import {
  formatUnixTimeToReadable,
  getCurrUnixTimestamp,
  tsAtMidnight,
} from './utils'
import { SEC_IN_DAY } from './utils/constants'
import './index.css'
import ControlEffect from './components/PlaybackControls/ControlEffect'

const { Play } = Icons

// Constants For Socket Connection
const POLL_INTERVAL = 500
const POLL_MAX_ATTEMPTS = 15
const ICE_HEALTH_TIMEOUT = 25000
const ICE_SERVER_TIMEOUT = 10000 //  server response timeout
const OFFER_TIMEOUT = 5000

const host = getHost()

// unix_ts is in seconds
const daysFromNow = unixTs => {
  const comparedDate = new Date(unixTs * 1000).getDate()
  const now = new Date().getDate()

  return now - comparedDate
}

// binary search, if found = data, else = nodata
// searched_ts must be in seconds
const dataFromTS = (unsortedArr, searchedTs, getNearest) => {
  const arr = unsortedArr.sort((a, b) => {
    return a.start_ts - b.start_ts
  })
  let minIndex = 0
  let maxIndex = arr.length - 1
  let currentIndex
  let currentElement

  while (minIndex <= maxIndex) {
    currentIndex = ((minIndex + maxIndex) / 2) | 0 // eslint-disable-line
    currentElement = arr[currentIndex]
    if (searchedTs > currentElement.end_ts / 1000) {
      minIndex += 1
    } else if (searchedTs < currentElement.start_ts / 1000) {
      maxIndex -= 1
    } else {
      return { el: currentElement, index: currentIndex }
    }
  }

  // if catalogue block that searched_ts is found in is not found, go through all the blocks and send the closest
  if (getNearest) {
    let closest = false
    let closestDiff = null
    let closestIndex = 0
    let currDiff

    for (let i = 0; i < arr.length; ++i) {
      currDiff = Math.abs(searchedTs - arr[i].start_ts / 1000)
      if (!closest || currDiff <= closestDiff) {
        closest = arr[i]
        closestDiff = currDiff
        closestIndex = i
      }
    }

    const res = { el: closest, index: closestIndex, closest: true }
    return res
  }
  return { el: false }
}

class VideoStream extends React.Component {
  constructor(props) {
    super(props)

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const startTimelineTS = Math.round(startDate.getTime() / 1000)
    const currTS = getCurrUnixTimestamp()

    this.mediaConstraints = {
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 0,
    }

    this.URL = window.URL || window.webkitURL
    const debugMode = this.props.debugMode ? this.props.debugMode : false
    const initView = this.props.willAutoLoad
      ? LiveStreamComponentState.LOADING
      : LiveStreamComponentState.PREVIEW

    this.debugMode = debugMode
    this.sessionId = makeUniqueId()
    this.previewFreq = this.props.previewFreq
      ? this.props.previewFreq
      : PreviewFrequency.SLOW
    // TODO(@rodaan): Snapshots should not be loaded from MySQL. We should make this faster by using a storage system
    // optimized for fast reads. For now, load snapshots every 5 minutes. This is necessary to improve page load time
    // and reduce server load please.
    if (this.props.debugMode) {
      this.previewIntervalMs = 1000 * 10
    } else if (this.previewFreq === PreviewFrequency.FAST) {
      this.previewIntervalMs = 1000 * 30
    } else {
      this.previewIntervalMs = 1000 * 300
    }
    this.autoReconnectAttempts = this.props.autoReconnectAttempts
      ? this.props.autoReconnectAttempts
      : 15
    this.reconnectTimeoutMs = this.props.reconnectTimeoutMs
      ? this.props.reconnectTimeoutMs
      : 1000
    // Constants
    this.pollCandidatesAttempts = 0
    this.sdpAnswerAccepted = false
    this.attemptNumber = 0
    this.candidates = []
    this.playing = false
    this.daysBackAccessible = 31

    // Amount of width increment timeline view when playing
    this.streamClockInterval = null

    // Store needed for getting last location to move progress bar
    this.lastUnixTs = null
    this.nextPlaybackStatus = PlaybackStatusEnum.LIVE

    this.pc = null
    this.peerConnId = null
    this.previewIntervalId = null
    this.pollCandidatesIntervalId = null
    this.iceServersResponseTimeoutId = null
    this.offerResponseTimeoutId = null
    this.healthTimeoutId = null
    this.iceConnectionHealthTimeoutId = null
    this.healthIntervalId = null
    this.reconnectTimeoutId = null
    this.handshakeStartTimestampMs = null

    this.originalEntities = []

    // promise returned from video playing
    // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    this.videoPlayPromise = undefined
    this.disconnected = false
    this.videoUnavailableMessage = null
    this.state = {
      catalogue: [],
      creatingDispatchRequest: false,
      datePickerSelectionTS: getCurrUnixTimestamp(),
      daysWithData: [],
      displayEntitySelector: false,
      displayMessage: false, // Loading Timeline
      displayTimeWindowIndicator: false,
      endTimelineTS: currTS,
      exportEndTS: null,
      exportStartTS: null,
      indicatorState: IndicatorState.DISCONNECTED,
      initTS: props.initTS,
      isCatalogueMissing: false,
      isDatePickerVisible: false,
      isHoveringOnTimeline: false,
      isArchiveVisible: false,
      isFollowing: true,
      isFullScreenVideo: false,
      isSeekTimeVisible: false,
      isZoomIn: 1,
      zoomLevel: 5, // default "2 minutes" level, expected values 1-10
      loading: false,
      loadingArchivalVideo: true,
      message: '', // Loading Timeline Before Displaying
      metadata: [],
      mouseIndicatorX: null, // x position from left-hand of timeline window (left is 0)
      mouseIndicatorY: null,
      playbackStatus: PlaybackStatusEnum.LIVE,
      playbackTimeWindow: SEC_IN_DAY,
      controlEffectIconName: VideoIconControlEffectEnum.PLAY,
      controlEffectTimeStamp: new Date().getTime(), // need this for key, else it will fire all the time (unique id) or never (same id)
      retention: {},
      selectedEntities: [],
      setInitTS: false,
      shouldDefinitelyResetPlayheadInRange: false,
      showDispatchMenu: false,
      signalProgress: 0, // From 0 to 100
      src: '',
      startTimelineTS,
      streamPlaceholder: '/static/img/placeholder.jpg',
      subtractDays: 0, // days from today aka 0 = today
      videoStreamTS: currTS,
      viewmode: this.props.streamType.toLowerCase(),
      viewState: initView,
    }

    this.videoElem = null

    this.init = this.init.bind(this)
    this.fetchPreview = this.fetchPreview.bind(this)
    this.play = this.play.bind(this)
    this.createPeerConnection = this.createPeerConnection.bind(this)
    this.sendCandidates = this.sendCandidates.bind(this)
    this.acceptAnswer = this.acceptAnswer.bind(this)
    this.stopPollingForCandidates = this.stopPollingForCandidates.bind(this)
    this.onTrack = this.onTrack.bind(this)
    this.onTimelineSelection = this.onTimelineSelection.bind(this)
    this.onTimelineSelectionContinued = this.onTimelineSelectionContinued.bind(
      this,
    )
    this.addIceCandidates = this.addIceCandidates.bind(this)
    this.iceConnectionFailed = this.iceConnectionFailed.bind(this)
    this.resetOfferResponseTimeout = this.resetOfferResponseTimeout.bind(this)
    this.onOfferResponseTimeout = this.onOfferResponseTimeout.bind(this)
    this.createOffer = this.createOffer.bind(this)
    this.startPollingForCandidates = this.startPollingForCandidates.bind(this)
    this.onDataChannelMessage = this.onDataChannelMessage.bind(this)
    this.onIceServersResponseTimeout = this.onIceServersResponseTimeout.bind(
      this,
    )
    this.requestCandidates = this.requestCandidates.bind(this)
    this.checkToCallPlayAgain = this.checkToCallPlayAgain.bind(this)
    this.toggleSetInitTS = this.toggleSetInitTS.bind(this)
    this.isTSWithinRetentionDays = this.isTSWithinRetentionDays.bind(this)

    // Playback controls functions
    this.handleExport = this.handleExport.bind(this)

    this.preInit = this.preInit.bind(this)
    this.getCatalogueData = this.getCatalogueData.bind(this)
    this.sendTooltipMessage = this.sendTooltipMessage.bind(this)

    // Kickoff
    this.preInit()
  }

  // Note: @Future: useRef of child component (when refactor VideoStreamV2 into functional
  // component. Also, ideal state is a function passed down which is called by child, not variable or ref
  // passed up to parent to call function in child component). https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  //
  // shouldDefinitelyResetPlayheadInRange() is used here because we can't pass a ref
  // from a parent class component to a child functional component (i tried every variation)
  // In this case, the current implementation passes a state variable of whether to run a function
  // in a child component.
  //
  // This variable sets "shouldResetPlayheadInRange" in PlaybackControls, and then
  // passes it down to child TimelineContainer, which on prop update,  runs
  // "resetPlayheadInRange"
  //
  setShouldDefinitelyResetPlayheadInRange = val => {
    this.setState({ shouldDefinitelyResetPlayheadInRange: val })
  }

  createDispatchRequest = (title, ts, callback) => {
    this.setState({ creatingDispatchRequest: true }, () => {
      // Create it here
      return api({
        url: `${host}/api/v2/${this.props.accountSlug}/${this.props.siteSlug}/alerts/custom/create/`,
        method: 'POST',
        data: {
          stream_id: `${this.props.streamId}`,
          name: title,
          ts,
        },
      })
        .then(response => {
          // Success message  -- notify user with tooltip or alert
        })
        .catch(err => {
          // Error message
        })
    })
  }

  toggleDispatchMenu = () => {
    this.setState({
      showDispatchMenu: !this.state.showDispatchMenu,
      isDatePickerVisible: false,
    })
  }

  toggleEntitySelectorDisplay = () => {
    this.setState({
      displayEntitySelector: !this.state.displayEntitySelector,
    })
  }

  componentWillUnmount() {
    this.props.unsubscribe(this.sessionId)
    this.stopPlayerClock()
    this.disconnect()
  }

  updateWithNewStream() {
    this.props.unsubscribe(this.sessionId)
    this.stopPlayerClock()
    this.disconnect()

    this.props.subscribe(this.sessionId, data => {
      this.onMessage(data)
    })
    // Always signal immediately
    this.signal()
  }

  componentDidUpdate(prevProps, prevState) {
    // recreate life cycle if stream was updated
    if (prevProps.streamId !== this.props.streamId) this.updateWithNewStream()

    // eslint-disable-next-line prefer-destructuring
    this.videoElem = this.videoContainer.children[0]
    this.videoElem.onLoadedData = () => {
      this.setState({ signalProgress: 100 })
      this.stopPollingForCandidates(() => {
        // video started playing
        if (this.healthTimeoutId) {
          clearTimeout(this.healthTimeoutId)
          this.healthTimeoutId = null
        }

        const now = new Date().getTime()
        console.debug(
          `[peerConnId=${
            this.peerConnId
          }] time taken to video.onloadeddata event: ${now -
            this.handshakeStartTimestampMs} ms`,
        )
      })
    }

    if (this.state.zoomLevel !== prevState.zoomLevel) {
      this.updateEntityMetadata()
    }
  }

  componentDidMount() {
    this.props.subscribe(this.sessionId, data => {
      this.onMessage(data)
    })
    // Always signal immediately
    this.signal()
  }

  // Archive Clip, ie. Export Mode = true
  //
  toggleExportMode = () => {
    this.setState({ isArchiveVisible: !this.state.isArchiveVisible }, () => {
      return this.state.isArchiveVisible
        ? this._turnExportModeOn()
        : this._turnExportModeOff() // eslint-disable-line
    })
  }

  _turnExportModeOn = () => {
    this.handlePlayPauseButton()
    // FUTURE: @eric handle this
    // this.stopPlayerClock()
    // this.onTimelineSelection(this.state.exportStartTS)
    // this.startPlayerClock()
    //
  }

  _turnExportModeOff = () => {
    this.changeExportTSRange(null, null)
    this.handleGoLiveButton()
  }

  isTSWithinRetentionDays(unixTs) {
    // Check how many days from now to that day
    // If less or equal to retention days then return true
    const diffDays = daysFromNow(unixTs)
    return this.state.retention.motion_segment_retention_days
      ? diffDays < this.state.retention.motion_segment_retention_days
      : diffDays < this.state.retention.retention_days
  }

  preInit() {
    // check to see if you need to Get Catalogue
    if (this.props.showPlaybackControls) {
      const midnightTS = tsAtMidnight()
      const nextTS = midnightTS + SEC_IN_DAY
      this.getCatalogueData(
        midnightTS,
        nextTS,
        (catalogue, daysWithData, entitySelectorOptions, retention) => {
          this.originalEntities = entitySelectorOptions
          this.setState(
            {
              catalogue,
              daysWithData,
              loadingArchivalVideo: false,
              entitySelectorOptions,
              retention,
            },
            () => {
              // Check if initTS is within the retention days. If not notify user
              this.jumpToInitTS()
            },
          )
        },
      )
    } else {
      this.init()
    }
  }

  jumpToInitTS = () => {
    if (this.props.initTS) {
      if (this.isTSWithinRetentionDays(this.props.initTS)) {
        // Calculate the subtractDays and selected date and handle the DatePicker Selection
        const subtractDays = daysFromNow(this.props.initTS)
        // If the initTS of the alert was too soon, set time a minute before ts_identifier since Video has not yet finished writing
        const initTS =
          new Date().getTime() / 1000.0 - this.props.initTS >= 60
            ? this.props.initTS
            : this.props.initTS - 60
        if (subtractDays <= 0) {
          this.setState(
            {
              setInitTS: true,
              initTS,
            },
            () => {},
          )
        } else {
          this.handleDatePickerSelection(
            subtractDays,
            this.props.initTS,
            true,
            () => {
              this.setState(
                {
                  setInitTS: true,
                  initTS,
                },
                () => {},
              )
            },
          )
        }
      } else {
        this.sendTooltipMessage(
          "Alert Instance's timestamp is older than Appliance's retention days",
          5000,
          () => {
            this.init()
          },
        )
      }
    } else {
      this.init()
    }
  }

  toggleSetInitTS(callback) {
    this.setState({ setInitTS: !this.state.setInitTS }, () => {
      if (callback) {
        callback()
      }
    })
  }

  init() {
    // Don't fetch previews immediately. Add timeout (jitter) upto 10 seconds
    setTimeout(this.fetchPreview, Math.floor(Math.random() * 3) * 1000)
    this.previewIntervalId = setInterval(
      this.fetchPreview,
      this.previewIntervalMs,
    )
    this.stopPlayerClock()
    this.startPlayerClock()
  }

  handleEnterFullScreenVideo = () => {
    this._enterFullscreenModeSetVariables()
  }

  _enterFullscreenModeSetVariables = () => {
    this.props.toggleFullscreenMode(true)
    this.props.setTimelineSettingPosition('overlay')
    this.props.toggleDarkMode(true)
    this._setFullscreenEventListener()
  }

  // removes event listeners
  // not used currently, because we probably should remove event listeners on the Video wall unmounting, else it will remove from the entire page
  _setFullscreenEventListener = () => {
    document.addEventListener(
      'fullscreenchange',
      this._handleFullscreenVideoEventListener,
    )
    document.addEventListener(
      'webkitfullscreenchange',
      this._handleFullscreenVideoEventListener,
    )
    document.addEventListener(
      'mozfullscreenchange',
      this._handleFullscreenVideoEventListener,
    )
    document.addEventListener(
      'MSFullscreenChange',
      this._handleFullscreenVideoEventListener,
    )
  }

  // Not yet cleaning up event listeners
  // _unsetFullscreenEventListener = () => {
  //   document.removeEventListener('fullscreenchange', this._handleFullscreenVideoEventListener)
  //   document.removeEventListener('webkitfullscreenchange', this._handleFullscreenVideoEventListener)
  //   document.removeEventListener('mozfullscreenchange', this._handleFullscreenVideoEventListener)
  //   document.removeEventListener('MSFullscreenChange', this._handleFullscreenVideoEventListener)
  // }

  _enterFullscreenBrowserRequest = () => {
    const container = this.containerRef
    if (container && container.requestFullScreen) {
      container.requestFullScreen()
    } else if (container.webkitRequestFullScreen) {
      container.webkitRequestFullScreen()
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen()
    }
  }

  // when exiting fullscreen with escape key (not clicking close and using onclick handler)
  // https://stackoverflow.com/questions/25126106/capture-esc-event-when-exiting-full-screen-mode
  _handleFullscreenVideoEventListener = () => {
    // check if its leaving fullscreen mode
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      this.handleExitFullScreenVideo() // run regular handle exit
    }
  }

  handleExitFullScreenVideo = () => {
    if (document.exitFullScreen) {
      document.exitFullScreen()
    } else if (document.webkitExitFullScreen) {
      document.webkitExitFullScreen()
    } else if (document.mozExitFullScreen) {
      document.mozExitFullScreen()
    }

    this.props.setTimelineSettingPosition('below')
    this.props.toggleDarkMode(false)
    this.props.toggleFullscreenMode(false)
  }

  stopVideoElem = () => {
    this.handlePlayPauseButton()
  }

  playElem = evt => {
    const isVideoExist =
      this.videoElem && (this.videoElem.src || this.videoElem.srcObject)
    if (isVideoExist) {
      this.showView(LiveStreamComponentState.STREAM, IndicatorState.LIVE)
      this.videoElem
        .play()
        .then(_ => {
          this.videoPlayPromise = _
        })
        .catch(err => {
          console.error(`Error playing stream: ${err}`)
        })
    }
  }

  fetchPreview() {
    // TODO: make ajax request
    return api({
      url: `${host}/api/v2/${this.props.accountSlug}/${this.props.siteSlug}/streams/${this.props.streamId}/snapshot/`,
      method: 'GET',
    })
      .then(response => {
        const { data } = response
        if (data.error) {
          console.warn('failed to fetch preview', data.error)
          return this.onPreviewFetch('/static/img/placeholder.jpg')
        }

        if (get(data, 'snapshot.data_str')) {
          return this.onPreviewFetch(data.snapshot.data_str)
        }

        return null

        // TODO: @rodaan --> Keeping for when we move thumbnail images to s3
        // return api({
        //   url: snapshot.data_str,
        //   method: 'GET',
        // }).then(responseImg => {
        //   return this.onPreviewFetch(responseImg.data)
        // })
      })
      .catch(err => {
        console.warn('failed to fetch preview', err)
        return this.onPreviewFetch('/static/img/placeholder.jpg')
      })
  }

  onPreviewFetch = src => {
    this.setState({ streamPlaceholder: src })
  }

  // onReceivingIceServers() - calls creation of peer connection and sets it to state along with other data
  onReceivingIceServers = iceservers => {
    this.resetIceServersResponseTimeout()
    this.pc = this.createPeerConnection(iceservers)
    this.pc.peerid = this.peerConnId
    this.createOffer()
    //   set timeout to check if webrtc connection got established
    if (this.iceConnectionHealthTimeoutId) {
      clearTimeout(this.iceConnectionHealthTimeoutId)
      this.iceConnectionHealthTimeoutId = null
    }

    this.iceConnectionHealthTimeoutId = setTimeout(() => {
      if (
        this.playing &&
        this.pc != null &&
        this.pc.iceConnectionState !== 'connected' &&
        this.pc.iceConnectionState !== 'completed'
      ) {
        // console.log('iceConnection not yet established, restarting stream')
        this.iceConnectionFailed()
      }
    }, ICE_HEALTH_TIMEOUT)
  }

  onDataChannelMessage = msg => {
    const data = JSON.parse(msg.data)
    let { streamId } = this.props
    if (this.state.viewmode === StreamTypeEnum.RECORDED) {
      streamId = `${this.props.streamId}-${this.peerConnId}`
    }
    const newState = {}
    const streamKey = `ipc:///tmp/ambient/streaming/${this.state.viewmode}-${streamId}.ipc`
    // dcTick. Check time and adjust if needed.
    if (get(data, 'msg', -1) === DataChannelCodeEnum.TICK) {
      if (streamKey in get(data, 'data', {})) {
        this.disconnected = false
        this.videoUnavailableMessage = null
        const streamTS = Math.floor(get(data, ['data', streamKey], 0) / 1000)
        // console.log(`Tick of ${streamId} at ${streamTS}, video at ${this.state.videoStreamTS}`)
        if (
          Math.abs(streamTS - this.state.videoStreamTS) > 2 &&
          this.state.playbackStatus !== PlaybackStatusEnum.PAUSED
        ) {
          // console.log(`Adjusting time of ${streamKey}`)
          newState.videoStreamTS = streamTS
        }
        newState.isCatalogueMissing = false
      }
      this.setState(newState)
    } else if (get(data, 'msg', -1) === DataChannelCodeEnum.MISSING) {
      // Show missing message.
      if (
        streamKey === get(data, 'data.streamId', '') &&
        get(data, 'data.next', 0) - get(data, 'data.ts', 0) > 5000
      ) {
        this.setState({ isCatalogueMissing: true })
      }
    } else if (get(data, 'msg', -1) === DataChannelCodeEnum.DOWN) {
      // console.log(`Stream ${streamId} is down`)
      this.disconnected = true
      this.videoUnavailableMessage = "Can't connect to source"
    }
  }

  sendCandidates = () => {
    console.debug(
      `[peerConnId=${this.peerConnId}] Sending ${this.candidates.length} candidates.`,
    )
    for (let i = 0; i < this.candidates.length; ++i) {
      this.props.sendCandidate({
        nodeId: this.props.nodeId,
        sessionId: this.props.sessionId,
        peerConnId: this.peerConnId,
        streamId: this.props.streamId,
        candidate: this.candidates[i],
      })
    }

    this.candidates = [] // reset
  }

  // onMessage() - receives messages and parses it
  onMessage = message => {
    // ignore messages not meant for me
    if (message.meantfor === 'browser' && message.uniqId === this.peerConnId) {
      if (message.type === 'iceservers') {
        console.debug(
          `[peerConnId=${this.peerConnId}] got socket msg, type:iceservers`,
        )
        this.onReceivingIceServers(message.data.iceservers)
        this.setState({
          signalProgress: 33,
        })
      } else if (message.type === 'answer') {
        console.debug(
          `[peerConnId=${this.peerConnId}] got socket msg, type:answer`,
        )
        const { answer } = message.data
        // console.debug(JSON.stringify(answer))
        this.sendCandidates()
        this.startPollingForCandidates()
        this.acceptAnswer(answer)
        this.sdpAnswerAccepted = true
        this.setState({
          signalProgress: 50,
        })
      } else if (message.type === 'candidates') {
        console.debug(
          `[peerConnId=${this.peerConnId}] got socket msg, type:candidates`,
        )
        this.addIceCandidates(message.data.candidates)
        const now = new Date().getTime()
        console.debug(
          `[peerConnId=${this.peerConnId}] time taken to handshake: `,
          now - this.handshakeStartTimestampMs,
          ' ms',
        )
        this.setState({
          signalProgress: 66,
        })
      } else if (message.type === 'hungup') {
        // console.log(
        //   `[peerConnId=${this.peerConnId}] stream hungup successfully`,
        // )
      } else if (message.type === 'callfailure') {
        console.debug(
          `[peerConnId=${this.peerConnId}] stream failed reason=${message.data.error}, disconnecting and replaying`,
        )
        this.iceConnectionFailed()
      }
    }
  }

  addIceCandidates(candidates) {
    console.debug(
      `[peerConnId=${this.peerConnId}] received ${candidates.length}`,
    )

    for (let i = 0; i < candidates.length; i++) {
      const candidate = new RTCIceCandidate(candidates[i])

      console.debug(
        `[peerConnId=${this.peerConnId}] Adding ICE candidate ${JSON.stringify(
          candidate,
        )}`,
      )
      if (this.pc) {
        this.pc.addIceCandidate(
          candidate,
          () => {
            console.debug(`[peerConnId=${this.peerConnId}] addIceCandidate OK`)
          },
          error => {
            console.warn(
              `[peerConnId=${
                this.peerConnId
              }] failed to addIceCandidate, error: ${error} icecandidate: ${JSON.stringify(
                candidate,
              )}`,
            )
          },
        )
      }
    }
  }

  resetOfferResponseTimeout() {
    if (this.offerResponseTimeoutId) {
      clearTimeout(this.offerResponseTimeoutId)
      this.offerResponseTimeoutId = null
    }
  }

  onOfferResponseTimeout() {
    console.warn(`[peerConnId=${this.peerConnId}] offer response timed out`)
    this.iceConnectionFailed()
  }

  createOffer() {
    try {
      this.pc
        .createOffer(this.mediaConstraints)
        .then(sessionDescription => {
          // onCreateOfferSuccess
          console.debug(`[peerConnId=${this.peerConnId}] Create offer`)
          // console.debug(JSON.stringify(sessionDescription))
          this.resetOfferResponseTimeout()
          return this.pc.setLocalDescription(sessionDescription)
        })
        .then(() => {
          this.offerResponseTimeoutId = setTimeout(
            this.onOfferResponseTimeout,
            OFFER_TIMEOUT,
          )
          // onSetLocalSuccess
          this.props.sendOffer({
            viewmode: this.state.viewmode,
            nodeId: this.props.nodeId,
            sessionId: this.props.sessionId,
            peerConnId: this.peerConnId,
            streamId: this.props.streamId,
            sessionDescription: this.pc.localDescription,
          })
        })
        .catch(error => {
          console.error(`Create offer error: ${JSON.stringify(error.message)}`)
          this.iceConnectionFailed()
        })
    } catch (error) {
      console.error(`Create offer error: ${JSON.stringify(error)}`)
      this.iceConnectionFailed()
    }
  }

  requestCandidates() {
    this.props.requestCandidates({
      viewmode: this.state.viewmode,
      nodeId: this.props.nodeId,
      sessionId: this.props.sessionId,
      peerConnId: this.peerConnId,
      streamId: this.props.streamId,
    })

    this.pollCandidatesAttempts += 1
    if (this.pollCandidatesAttempts >= POLL_MAX_ATTEMPTS) {
      this.stopPollingForCandidates()
    }
  }

  startPollingForCandidates(cb) {
    // keep polling for ice candidates
    this.stopPollingForCandidates()
    // Immediately request and start a timer
    this.requestCandidates()
    this.pollCandidatesIntervalId = setInterval(
      this.requestCandidates,
      POLL_INTERVAL,
    )
    if (cb) {
      cb()
    }
  }

  stopPollingForCandidates(cb) {
    this.pollCandidatesAttempts = 0
    if (this.pollCandidatesIntervalId) {
      clearInterval(this.pollCandidatesIntervalId)
      this.pollCandidatesIntervalId = null
    }
    if (cb) {
      cb()
    }
  }

  acceptAnswer(sdpAnswer) {
    this.resetOfferResponseTimeout()
    if (this.pc && this.pc.signalingState !== 'stable') {
      this.pc
        .setRemoteDescription(sdpAnswer)
        .then(() => {
          console.debug(
            `[peerConnId=${this.peerConnId}] setRemoteDescription ok`,
          )
        })
        .catch(error => {
          console.error(
            `[peerConnId=${this.peerConnId}] setRemoteDescription error:`,
            JSON.stringify(error),
          )
          this.iceConnectionFailed()
        })
    }
  }

  onIceConnectionConnected = () => {
    // makes video element style more opaque
    // let videoElement = this.getVideoElem();
    //
    // this.ts_first_byte = new Date().getTime()
    this.resetIceServersResponseTimeout()
    if (this.videoElem) {
      this.videoElem.style.opacity = '1.0'
    }
    this.attemptNumber = 0
    this.reconnectTimeoutMs = 1000
    this.disconnected = false
    // clear timeouts and intervals
    if (this.previewIntervalId) {
      clearInterval(this.previewIntervalId)
    }

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnecttimeoutid)
      this.reconnectTimeoutId = null
    }

    if (this.iceConnectionHealthTimeoutId) {
      clearTimeout(this.iceConnectionHealthTimeoutId)
      this.iceConnectionHealthTimeoutId = null
    }

    // take the new video stream fullscreen
    if (
      this.videoElem &&
      (this.videoElem.src || this.videoElem.srcObject) &&
      this.props.vms.isFullscreenMode
    ) {
      this._enterFullscreenBrowserRequest()
    }
  }

  iceConnectionFailed = () => {
    this.disconnect()
    this.resetIceServersResponseTimeout()
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = null
    }
    // reconnect mechanism
    this.attemptNumber += 1
    if (
      (this.attemptNumber > this.autoReconnectAttempts &&
        this.attemptNumber !== 0) ||
      this.reconnectTimeoutMs >= 1800000
    ) {
      // Attempts failed for at least an hour, back off for now
      console.info(
        'All attempts exhausted, autoReconnectAttempts was ',
        this.attemptNumber,
      )
      this.attemptNumber = 0
      this.reconnectTimeoutMs = 1000
    } else {
      this.reconnectTimeoutId = setTimeout(() => {
        this.signal()
      }, this.reconnectTimeoutMs)
    }
    this.reconnectTimeoutMs *= 2 // Exponential backoff
  }

  onIceConnectionDisconnected = () => {
    if (this.videoElem) {
      this.videoElem.style.opacity = '0.25'
    }
    this.disconnected = true
    this.videoUnavailableMessage = null
    this.showView(null, IndicatorState.DISCONNECTED, () => {
      this.iceConnectionFailed()
    })
  }

  // Its supposed to control the "LIVE", "RECORDED", indicator and help transition between these states.
  // It keeps track of what the lastUnixTs playing was
  showView = (viewType, indicatorState, cb) => {
    // updates the view type and the indicator status
    const newState = {}
    if (indicatorState) {
      newState.indicatorState = indicatorState
    }
    // Switching to Live
    if (this.nextPlaybackStatus === PlaybackStatusEnum.LIVE) {
      newState.indicatorState = IndicatorState.LIVE
      newState.videoStreamTS = getCurrUnixTimestamp()
      // when playing LIVE keep updating value
    } else if (this.nextPlaybackStatus === PlaybackStatusEnum.PLAYING) {
      newState.videoStreamTS = this.lastUnixTs
      newState.indicatorState = IndicatorState.RECORDED
      newState.playbackStatus = this.nextPlaybackStatus
    } else if (this.lastPlaybackStatus === PlaybackStatusEnum.LIVE) {
      newState.videoStreamTS = this.timestampBeforeRecorded
      newState.indicatorState = IndicatorState.RECORDED
    } else {
      newState.videoStreamTS = this.lastUnixTs
      newState.indicatorState = IndicatorState.RECORDED
    }

    if (viewType) {
      newState.viewState = viewType
    }

    this.setState(newState, () => {
      this.stopPlayerClock()
      this.startPlayerClock()
      if (cb) {
        cb()
      }
    })
  }

  onIceConnectionClosed = () => {
    // let videoElement = this.getVideoElem();
    // TODO: Handle via state
    if (this.videoElem) {
      this.videoElem.style.opacity = '0.5'
    }
    this.showView(
      LiveStreamComponentState.LOADING,
      IndicatorState.DISCONNECTED,
      () => {
        this.iceConnectionFailed()
      },
    )
  }

  onIceConnectionStateChange = (pc, evt) => {
    // console.log(
    //   `[peerConnId=${this.peerConnId}] iceConnectionState changed to: ${pc.iceConnectionState}`,
    // )

    if (pc.iceConnectionState === 'connected') {
      this.onIceConnectionConnected()
      this.disconnected = false
    } else if (pc.iceConnectionState === 'disconnected') {
      pc.restartIce()
      if (pc.connectionState !== 'connected') {
        this.onIceConnectionDisconnected()
        this.disconnected = true
      }
    } else if (
      pc.iceConnectionState === 'failed' ||
      pc.iceConnectionState === 'closed'
    ) {
      this.onIceConnectionClosed()
    }
  }

  // createPeerConnection() - creates a peer connection by getting a list of iceservers ands add tracks to peer connection
  createPeerConnection(iceservers) {
    // console.log(`Received ${iceservers.iceServers.length} iceservers`)

    const options = { optional: [{ DtlsSrtpKeyAgreement: true }] }
    const newIceServers = []

    for (let i = 0; i < iceservers.iceServers.length; i++) {
      let server = iceservers.iceServers[i]
      if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
        // eslint-disable-line
        server = JSON.parse(JSON.stringify(server))
        server.urls = server.url
      }
      newIceServers.push(server)
    }

    const config = { iceServers: newIceServers }
    const pc = new RTCPeerConnection(config, options)
    pc.onconnectionstatechange = evt => {
      // console.log(pc.connectionState)
    }
    pc.ondatachannel = evt => {
      pc.datachannel = evt.channel
      pc.datachannel.onmessage = this.onDataChannelMessage
    }

    pc.onicecandidate = evt => {
      const { candidate } = evt
      if (candidate) {
        this.candidates = this.candidates.concat(evt.candidate)
        // Send candidates only after the answer has been accepted
        // to ensure the other peer has a peerConn created for this peer
        // IMPORTANT: This candidate gathering can happen very fast on mobile.
        // So make sure sendCandidates() is called explicitly after accepting
        // answer also.
        if (this.sdpAnswerAccepted) {
          this.sendCandidates()
        }
      }
    }

    if (typeof pc.ontrack !== 'undefined') {
      pc.ontrack = this.onTrack
    } else {
      pc.onaddstream = this.onTrack
    }

    pc.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(
      this,
      pc,
    )
    return pc
  }

  _clearIntervals = () => {
    if (this.previewIntervalId) {
      clearInterval(this.previewIntervalId)
    }

    if (this.healthTimeoutId) {
      clearTimeout(this.healthTimeoutId)
      this.healthTimeoutId = null
    }

    if (this.healthIntervalId) {
      clearInterval(this.healthIntervalId)
      this.healthIntervalId = null
    }

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = null
    }

    if (this.iceConnectionHealthTimeoutId) {
      clearTimeout(this.iceConnectionHealthTimeoutId)
      this.iceConnectionHealthTimeoutId = null
    }
  }

  // disconnects video stream
  disconnect = () => {
    // console.info(`Video stream disconnected for peerConnId=${this.peerConnId}`)
    this._clearIntervals()
    this.stopPollingForCandidates()
    this.resetIceServersResponseTimeout()
    this.resetOfferResponseTimeout()
    this.sdpAnswerAccepted = false
    this.playing = false

    this.candidates = []
    if (this.pc) {
      console.debug(
        `[peerConnId=${this.peerConnId}] sending hangup to video server`,
      )

      this.props.hangup({
        nodeId: this.props.nodeId,
        sessionId: this.props.sessionId,
        peerConnId: this.peerConnId,
        streamId: this.props.streamId,
      })

      const peerConnId = this.peerConnId.slice(0)
      console.debug(`[peerConnId=${peerConnId}] calling pc.close()`)
      try {
        this.pc.close()
      } catch (e) {
        console.warn(
          `[peerConnId=${this.peerConnId}] failed to close peer connection:${e}`,
        )
      }
      // Clear all events on peer connection. It looks like setting pc to null still calls this event
      // This leads to a "destroy"ed stream to immediately start again due to the reconnect attempts in this method.
      if (this.pc) {
        this.pc.oniceconnectionstatechange = null
        this.pc = null
      }
    }
  }

  // onTrack() - adds a remote track to
  onTrack(event) {
    let stream

    if (event.streams) {
      ;[stream] = event.streams
    } else {
      stream = event.stream
    }

    try {
      this.videoElem.srcObject = stream
    } catch (error) {
      try {
        this.videoElem.src = this.URL.createObjectURL(stream)
      } catch (error2) {
        console.error(error2)
      }
    }
    // if archival
    if (this.nextPlaybackStatus === PlaybackStatusEnum.PLAYING) {
      this.updateArchivalPlayTime(this.lastUnixTs)
    }
    if (this.props.willAutoLoad) {
      this.playElem()
    }
  }

  // rtc stream always has 'live' mode
  // when switching to 'archive' mode, it sends a new message thru websocket
  // to setup a new rtc stream for the archive stream
  // thus, disconnect, init and signal
  changeViewMode = (viewmode, cb) => {
    if (this.state.viewmode !== viewmode) {
      this.setState({ viewmode }, () => {
        this.disconnect()
        this.init()
        this.signal()
        if (cb) {
          cb()
        }
      })
    } else if (cb) {
      cb()
    }
  }

  resetIceServersResponseTimeout() {
    if (this.iceServersResponseTimeoutId) {
      clearTimeout(this.iceServersResponseTimeoutId)
      this.iceServersResponseTimeoutId = null
    }
  }

  onIceServersResponseTimeout() {
    this.iceConnectionFailed()
  }

  signal = () => {
    /* Start the WebRTC signalling process
     */
    // Record Start Stream Event

    this.peerConnId = makeUniqueId()
    // console.log(
    //   `[peerConnId=${this.peerConnId}] Started signalling for streamId=${this.props.streamId}`,
    // )

    this.sdpAnswerAccepted = false
    this.playing = true
    this.candidates = []
    this.handshakeStartTimestampMs = new Date().getTime()

    this.props.requestIceServers({
      nodeId: this.props.nodeId,
      sessionId: this.props.sessionId,
      peerConnId: this.peerConnId,
    })

    this.resetIceServersResponseTimeout()
    this.iceServersResponseTimeoutId = setTimeout(
      this.onIceServersResponseTimeout,
      ICE_SERVER_TIMEOUT,
    )
  }

  // play - starts the video stream
  play() {
    // this.hidePlayIcon();
    // this.showLoadingElem();
    // this.hidePreviewElem();
    // Stop previewing and start playing the video (even if loading)
    if (this.previewIntervalId) {
      clearInterval(this.previewIntervalId)
      console.debug(`[peerConnId=${this.peerConnId}] stopped updating preview`)
    }

    if (
      !this.playing &&
      this.state.viewState !== LiveStreamComponentState.LOADING
    ) {
      this.showView(LiveStreamComponentState.LOADING, null)
    }
  }

  checkToCallPlayAgain() {
    if (this.iceConnectionHealthTimeoutId) {
      clearTimeout(this.iceConnectionHealthTimeoutId)
      this.iceConnectionHealthTimeoutId = null
    }

    this.healthIntervalId = setInterval(() => {
      if (this.state.playing && this.pc == null) {
        this.signal()
      }
    }, this.reconnectTimeoutMs)
  }

  // sends redux action to send websocket message to update the video play time
  updateArchivalPlayTime = ts => {
    this.props.updateArchivalPlayTime({
      streamId: this.props.streamId,
      uniqId: this.peerConnId,
      nodeId: this.props.nodeId,
      sessionId: this.props.sessionId,
      ts: ts * 1000,
    })
  }

  archivePage() {
    window.location.href = `/accounts/${this.props.accountSlug}/sites/${this.props.siteSlug}/archives`
  }

  // HandleExport() => Saves Archive Video Clip
  //
  // Checks if archive is in-bounds
  // Sends Archive Request to API
  // Closes Archive Mode
  // Messages tooltip
  //
  handleExport() {
    let message
    // Check if catalogue data exists
    if (this.state.exportStartTS !== null && this.state.exportEndTS !== null) {
      const currTS = new Date().getTime() / 1000

      if (
        this.state.exportStartTS <= currTS ||
        this.state.exportEndTS <= currTS
      ) {
        message = (
          <span style={{ textAlign: 'center', justifyContent: 'center' }}>
            Your recording is being saved. It will be available to view in{' '}
            <button
              style={{ margin: '7px', align: 'center' }}
              type='button'
              onClick={this.archivePage}
            >
              Archives
            </button>
          </span>
        )

        // Used for creation of video export file name. Adding both stream id and start and end ts.
        const uniq = makeUniqueId()
        // console.log(
        //   `[Archival] Requesting export for start_ts=${this.state.exportStartTS}, end_ts=${this.state.exportEndTS}, uniq=${uniq}`,
        // )
        this.props.sendExportRequest({
          streamId: this.props.streamId,
          // TODO: DOS possibility. Machine Perception Team wanted exported videos to contain stream id and the start and end time stamps.
          // Math.floor is needed because video exports URL does not take in decimal so must be a round number
          uniqId: `${uniq}-${this.props.streamId}-${Math.floor(
            this.state.exportStartTS,
          )}-${Math.floor(this.state.exportEndTS)}`,
          nodeId: this.props.nodeId,
          sessionId: this.props.sessionId,
          startTs: this.state.exportStartTS * 1000,
          endTs: this.state.exportEndTS * 1000,
        })
        this.toggleExportMode()
      } else {
        message = <span>The desired time range has yet to occur.</span>
      }
    } else {
      message = (
        <span>
          Please indicate the start and end time of the clip you would like to
          extract by dragging both the Clip Selector handles on the Timeline.
        </span>
      )
    }
    this.sendTooltipMessage(message, 5000)
  }

  changeExportTSRange = (startTs, endTs) => {
    this.setState({
      exportStartTS: startTs,
      exportEndTS: endTs,
    })
  }

  stopPlayerClock = () => {
    if (this.streamClockInterval) {
      clearInterval(this.streamClockInterval)
      this.streamClockInterval = null
    }
  }

  startPlayerClock = () => {
    if (!this.streamClockInterval) {
      this.streamClockInterval = setInterval(() => {
        const newClockState = {}
        if (this.nextPlaybackStatus === PlaybackStatusEnum.LIVE) {
          newClockState.videoStreamTS = getCurrUnixTimestamp()
          newClockState.endTimelineTS = getCurrUnixTimestamp()
        } else if (this.nextPlaybackStatus === PlaybackStatusEnum.PLAYING) {
          newClockState.videoStreamTS = this.state.videoStreamTS + 1
        }
        this.setState(newClockState, () => {})
      }, 1000)
    }
  }

  handlePlayPauseButton = () => {
    // we need this param to detect if it's called because of the +/- 10 sec button or not
    if (this.state.playbackStatus === PlaybackStatusEnum.LIVE) {
      this._handlePlayPauseOnLive()
    } else if (this.state.playbackStatus === PlaybackStatusEnum.PAUSED) {
      this._handlePlayPauseOnPaused()
    } else if (this.state.playbackStatus === PlaybackStatusEnum.PLAYING) {
      this._handlePlayPauseOnPlaying()
    }
  }

  _handlePlayPauseOnLive = () => {
    const newState = {}
    this.pauseVideo()
    this.stopPlayerClock()
    newState.controlEffectIconName = VideoIconControlEffectEnum.PAUSE
    newState.controlEffectTimeStamp = new Date().getTime()

    newState.indicatorState = IndicatorState.RECORDED
    newState.playbackStatus = PlaybackStatusEnum.PAUSED

    this.lastPlaybackStatus = PlaybackStatusEnum.LIVE
    this.timestampBeforeRecorded = getCurrUnixTimestamp()
    this.setState(newState)
  }

  _handlePlayPauseOnPaused = () => {
    const newState = {}
    newState.controlEffectIconName = VideoIconControlEffectEnum.PLAY
    newState.controlEffectTimeStamp = new Date().getTime()

    if (this.lastPlaybackStatus === PlaybackStatusEnum.LIVE) {
      this.nextPlaybackStatus = PlaybackStatusEnum.LIVE
      newState.playbackStatus = PlaybackStatusEnum.LIVE
      newState.lastPlaybackStatus = PlaybackStatusEnum.PAUSED
      this.setState(newState, () => {
        this.startPlayerClock()
        this.playVideo()
      })
    } else if (this.lastPlaybackStatus === PlaybackStatusEnum.PLAYING) {
      this.nextPlaybackStatus = PlaybackStatusEnum.PLAYING
      newState.playbackStatus = PlaybackStatusEnum.PLAYING
      newState.lastPlaybackStatus = PlaybackStatusEnum.PAUSED
      this.onTimelineSelectionContinued(this.lastUnixTs)
      this.setState(newState)
    }
  }

  _handlePlayPauseOnPlaying = () => {
    const newState = {}

    newState.controlEffectIconName = VideoIconControlEffectEnum.PAUSE
    newState.controlEffectTimeStamp = new Date().getTime()

    this.lastPlaybackStatus = PlaybackStatusEnum.PLAYING
    newState.playbackStatus = PlaybackStatusEnum.PAUSED
    this.lastUnixTs = this.state.videoStreamTS
    this.pauseVideo()
    this.stopPlayerClock()
    this.setState(newState)
  }

  handleGoLiveButton = () => {
    const newState = {
      isFollowing: true,
      subtractDays: 0,
    }
    if (this.state.playbackStatus !== PlaybackStatusEnum.LIVE) {
      const midnightTS = tsAtMidnight()
      const nextTS = midnightTS + SEC_IN_DAY
      this.getCatalogueData(midnightTS, nextTS, (catalogue, daysWithData) => {
        this.setState(
          {
            catalogue,
            daysWithData,
            loadingArchivalVideo: false,
          },
          () => {
            this.nextPlaybackStatus = PlaybackStatusEnum.LIVE
            this.changeViewMode(StreamTypeEnum.NORMAL, () => {
              if (this.state.playbackStatus !== PlaybackStatusEnum.LIVE) {
                const curr = new Date()
                curr.setHours(0, 0, 0, 0)
                const startTimelineTS = Math.round(curr.getTime() / 1000)
                const unixTs = getCurrUnixTimestamp()
                newState.playbackStatus = PlaybackStatusEnum.LIVE
                newState.datePickerSelectionTS = unixTs
                newState.startTimelineTS = startTimelineTS
                newState.endTimelineTS = unixTs
                this.setState(newState)
              }
            })
          },
        )
      })
    } else {
      this.setState(newState)
    }
  }

  getControlIconEffectName = seconds => {
    if (seconds === -10) return VideoIconControlEffectEnum.BACK10
    if (seconds === -5) return VideoIconControlEffectEnum.BACK5
    if (seconds === -1) return VideoIconControlEffectEnum.BACK1
    if (seconds < 0) return VideoIconControlEffectEnum.BACK
    if (seconds === 10) return VideoIconControlEffectEnum.FORWARD10
    if (seconds === 5) return VideoIconControlEffectEnum.FORWARD5
    if (seconds === 1) return VideoIconControlEffectEnum.FORWARD1
    if (seconds > 0) return VideoIconControlEffectEnum.FORWARD
    return VideoIconControlEffectEnum.FORWARD
  }

  // move forward x seconds (or back with negative x) in video
  handleStepInSeconds = (seconds = 10) => {
    const requestedTs = this._getUnixTsWithOffsetSeconds(
      this.state.videoStreamTS,
      seconds,
    )

    this.setState({
      controlEffectIconName: this.getControlIconEffectName(seconds),
      controlEffectTimeStamp: new Date().getTime(),
    })

    // if requested time is after current time
    if (this._isTsInTheFuture(requestedTs)) {
      this.handleGoLiveButton()
    } else {
      this.lastUnixTs = requestedTs
      this.updateArchivalPlayTime(requestedTs)

      if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
        this.nextPlaybackStatus = PlaybackStatusEnum.PLAYING
        this.changeViewMode(StreamTypeEnum.RECORDED)
      } else {
        this.setStopFollowing()
        this.onTimelineSelectionContinued(requestedTs)
      }
    }
  }

  _isTsInTheFuture = ts => {
    return ts > getCurrUnixTimestamp()
  }

  _getUnixTsWithOffsetSeconds = (unixTs, offsetSeconds) => {
    return Number(unixTs) + offsetSeconds
  }

  // This is the main method that starts the archival stream
  onTimelineSelection = unixTs => {
    this.lastUnixTs = unixTs

    // used to set a max when in recorded/archival state
    if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
      this.nextPlaybackStatus = PlaybackStatusEnum.PLAYING
      this.timestampBeforeRecorded = getCurrUnixTimestamp()
      this.changeViewMode(StreamTypeEnum.RECORDED, () => {
        this.onTimelineSelectionContinued(unixTs)
      })
    } else {
      this.onTimelineSelectionContinued(unixTs)
    }
  }

  // 1) checks if video exists, plays html video and stores promise in class variable
  playVideo = () => {
    if (this.videoElem) {
      this.videoPlayPromise = this.videoElem.play()
    }
  }

  // 1) checks if video elem exists and if the video play promise exists
  // 2) takes the play promise and then pauses the video element
  // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
  pauseVideo = () => {
    if (this.videoElem) {
      if (this.videoPlayPromise === undefined) {
        this.videoPlayPromise = this.videoElem.play()
      }
      this.videoPlayPromise
        .then(() => {
          // We can now safely pause video...
          this.videoElem.pause()
          // console.log('pauseVideo', this.videoPlayPromise, this.videoElem)
        })
        .catch(error => {
          // Auto-play was prevented
          // Show paused UI.
          // console.debug('error pausing video')
        })
    }
  }

  onTimelineSelectionContinued = (unixTs, cb) => {
    this.stopPlayerClock()
    this.updateArchivalPlayTime(unixTs)
    //     Send datachannel message to reset stream.
    if (
      this.pc &&
      this.pc.datachannel &&
      this.pc.datachannel.readyState === 'open'
    ) {
      const resetDataChannelMessage = {
        cmd: 'reset',
        data: {
          streamKey: this.props.streamId,
          uniq: this.peerConnId,
          mode: this.state.viewmode,
        },
      }
      this.pc.datachannel.send(JSON.stringify(resetDataChannelMessage))
    }
    const newState = {
      videoStreamTS: unixTs,
      indicatorState: IndicatorState.RECORDED,
      playbackStatus: PlaybackStatusEnum.PLAYING,
      isFollowing: false,
    }

    this.setState(newState, () => {
      this.playVideo()
      this.startPlayerClock()
      if (cb) {
        cb()
      }
    })
  }

  // returns width in percent 0 - 100
  //
  getWidthOfTsInPercent = ts => {
    const { playbackTimeWindow } = this.state
    const timeWindow = Number(playbackTimeWindow)
    const nowTs = getCurrUnixTimestamp()
    const earliest = nowTs - timeWindow
    const diff = ts - earliest
    const width = (diff / timeWindow) * 100

    return width
  }

  _convertPercentToDecimal = number => {
    return number / 100
  }

  // accepts a callback function
  toggleDatePicker = cb => {
    this.setState(
      {
        isDatePickerVisible: !this.state.isDatePickerVisible,
        showDispatchMenu: false,
      },
      () => {
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )
  }

  getCatalogueData(startDate, endDate, callback) {
    let apiEndpoint = `${host}/api/v2/accounts/${this.props.accountSlug}/sites/${this.props.siteSlug}/streams/${this.props.streamId}/catalogue`
    if (startDate) {
      apiEndpoint = `${apiEndpoint}?start_date=${startDate}&end_date=${endDate}`
    }
    api({
      url: apiEndpoint,
      method: 'GET',
    })
      .then(response => {
        const { data } = response
        // console.log('Getting catalog data - Received from Appliance')
        if (callback) {
          callback(
            data.catalogue,
            data.available_days,
            data.entity_selections,
            data.retention,
          )
        }
      })
      // TESTING
      .catch(err => {
        // console.log('Getting catalog data - MOCKING IT')
        console.error(err)
        if (callback && mockCatalog) {
          callback(
            mockCatalog.catalogue,
            mockCatalog.available_days,
            mockCatalog.entity_selections,
            mockCatalog.retention,
          )
        }
      })
  }

  // _createEntityMetadataQuery takes selected entities and returns an array of strings, each of type and name, separated by underscores
  // input: array of objects selected: ie. [
  //  {label: "person", value: 1, idx: 0, color: "#1ab394", type: "entity"},
  //  {label: "removed", value: "i_1", idx: 1, color: "#0ABFFC", type: "interaction"},
  //  {label: "box", value: "i_1_2", idx: 1, color: "#0ABFFC", type: "entity"}
  // ]
  // returns ie. ["entity_person", "interaction_removed", "entity_box"]

  // TODO: @rodaan - create functionality for synonyms, etc. Quick hack for now
  // You can do the following:
  // let label = el.label === 'removing' ? 'carrying' : el.label;
  //
  _createEntityMetadataQuery = () => {
    const query =
      this.state.selectedEntities &&
      this.state.selectedEntities.map(el => {
        return `${el.type}_${el.label}`
      })
    return query
  }

  _createEntityMetadataApiUrl = (
    startDate,
    endDate,
    queryString,
    aggregationSize,
  ) => {
    const { accountSlug, siteSlug, streamId } = this.props

    const uri = `${host}/api/v2/accounts/${accountSlug}/sites/${siteSlug}/streams/${streamId}/metadata` // production
    const params = startDate
      ? `?&start_date=${startDate}&end_date=${endDate}&query=${queryString}`
      : ''

    const extraParams = `&aggregationSize=${aggregationSize}s`

    return `${uri}${params}${extraParams}`
  }

  _getAggregationSizeFromZoomLevel = () => {
    return 10
  }

  updateEntityMetadata = () => {
    const { selectedEntities } = this.state
    if (selectedEntities && selectedEntities.length > 0) {
      this.getEntityMetadata(
        this.state.startTimelineTS,
        this.state.endTimelineTS,
      )
    }
  }

  // for entity search
  //
  getEntityMetadata = (startDate, endDate, cb) => {
    const query = this._createEntityMetadataQuery()
    if (query) {
      const aggregationSize = this._getAggregationSizeFromZoomLevel() // could make param instead as input
      const url = this._createEntityMetadataApiUrl(
        startDate,
        endDate,
        query,
        aggregationSize,
      )

      api({
        url,
        method: 'GET',
      }).then(
        res => {
          this.setState({ metadata: res.data.metadata }, () => {
            if (cb) {
              cb(res.data.metadata)
            }
          })
        },
        err => {
          console.debug('Using mock entity search metadata')
          this.setState({ metadata: mockEntities.metadata })
        },
      )
    }
  }

  // subtractDays are always the days from today
  handleDatePickerSelection = (
    subtractDays,
    selectedDate,
    isAlertJump,
    callback,
  ) => {
    const curr = new Date()
    curr.setHours(0, 0, 0, 0)
    const startTimelineTS =
      Math.round(curr.getTime() / 1000) - SEC_IN_DAY * subtractDays
    const endTimelineTS = startTimelineTS + SEC_IN_DAY - 1
    this.getCatalogueData(
      startTimelineTS,
      endTimelineTS,
      (catalogue, daysWithData) => {
        // If catalogue exists or if the days back selected (subtractDays) is within the daysWithData array, which means data exists
        if (
          catalogue.length === 0 &&
          daysWithData.indexOf(subtractDays) === -1
        ) {
          // only do it if it changes day
          // check to see if it is current date
          this.setState(
            {
              message: 'No Archival Video Found for this Day.',
              displayMessage: true,
            },
            () => {
              setTimeout(() => {
                this.setState(
                  {
                    displayMessage: false,
                    message: '',
                  },
                  () => {
                    if (callback) {
                      callback()
                    }
                  },
                )
              }, 2500)
            },
          )
        } else if (startTimelineTS === tsAtMidnight()) {
          // send to live
          this.setState(
            {
              catalogue,
              daysWithData,
              datePickerSelectionTS: startTimelineTS,
              startTimelineTS,
              endTimelineTS,
              loadingArchivalVideo: false,
              subtractDays: 0,
            },
            () => {
              this.handleGoLiveButton()
              if (this.state.selectedEntities.length > 0) {
                this.getEntityMetadata(startTimelineTS, endTimelineTS, () => {
                  if (callback) {
                    callback()
                  }
                })
              } else if (callback) {
                callback()
              }
            },
          )
        } else {
          // Go to Selected Previous Day
          // 1) Check if catalogue exists.
          // 2)  If so, it will start at earliest clip on transition.
          // 3) Else if it is nonmotion retention data, then start at beginning of timeline.

          let startingTS =
            catalogue.length > 0
              ? catalogue[0].start_ts / 1000
              : startTimelineTS

          if (isAlertJump) {
            startingTS = selectedDate
          }

          this.lastUnixTs = startingTS
          this.setState(
            {
              catalogue,
              datePickerSelectionTS: startTimelineTS,
              daysWithData,
              endTimelineTS,
              loadingArchivalVideo: false,
              startTimelineTS,
              subtractDays,
              videoStreamTS: startingTS,
            },
            () => {
              if (this.state.selectedEntities.length > 0) {
                this.getEntityMetadata(startTimelineTS, endTimelineTS, () => {
                  if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
                    this.pauseVideo()
                    this.nextPlaybackStatus = PlaybackStatusEnum.PLAYING
                    this.timestampBeforeRecorded = getCurrUnixTimestamp()
                    this.changeViewMode(StreamTypeEnum.RECORDED, () => {
                      this.pauseVideo()
                      if (callback) {
                        callback()
                      }
                    })
                  } else {
                    if (!this.streamClockInterval) {
                      this.startPlayerClock()
                    }
                    this.onTimelineSelectionContinued(startingTS, () => {
                      if (callback) {
                        callback()
                      }
                    })
                  }
                })
              } else if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
                this.pauseVideo()
                this.nextPlaybackStatus = PlaybackStatusEnum.PLAYING
                this.timestampBeforeRecorded = getCurrUnixTimestamp()
                this.changeViewMode(StreamTypeEnum.RECORDED, () => {
                  this.pauseVideo()
                  if (callback) {
                    callback()
                  }
                })
              } else {
                if (!this.streamClockInterval) {
                  this.startPlayerClock()
                }
                this.onTimelineSelectionContinued(startingTS, () => {
                  if (callback) {
                    callback()
                  }
                })
              }
            },
          )
        }
      },
    )
  }

  handleEntitySelection = selection => {
    const newState = {}

    // Determine how many selections were made.
    const level = selection && selection.length
    // If 1 get level 1 tree (interactions or props)
    // If 2 get level 2 (interactions objects)

    // TODO: @rodaan - Currently structured to only 3 levels for now
    //  Will need to set up to be more flexible later
    let entitySelectorOptions
    if (level === 0) {
      entitySelectorOptions = this.originalEntities
      this.subTree = EntitySubSelectionTree
    } else if (level === 1) {
      // Initial entities come from DB
      this.subTree = EntitySubSelectionTree[selection[0].label]
      entitySelectorOptions = get(this.subTree, 'options', [])
      this.subTree = get(this.subTree, 'options', [])
    } else if (level === 2) {
      const last = selection[level - 1]
      // Rest come from EntitySubSelection Tree
      entitySelectorOptions = this.subTree[last.idx].options
    } else if (level === 3) {
      entitySelectorOptions = []
    } else {
      entitySelectorOptions = this.originalEntities
      this.subTree = EntitySubSelectionTree
    }
    newState.entitySelectorOptions = entitySelectorOptions || []

    newState.selectedEntities = selection

    // Create model based on selections
    this.setState(newState, () => {
      const { selectedEntities } = this.state
      if (selectedEntities && selectedEntities.length > 0) {
        this.getEntityMetadata(
          this.state.startTimelineTS,
          this.state.endTimelineTS,
          metadata => {},
        )
      }
    })
  }

  setStopFollowing = () => {
    this.setState({ isFollowing: false })
  }

  setIsFollowing = cb => {
    this.setState({ isFollowing: true }, () => {
      if (cb) {
        cb()
      }
    })
  }

  setZoomLevel = zoomLevel => {
    this.setState({ zoomLevel })
  }

  toggleSeekTime = () => {
    this.setState({ isSeekTimeVisible: !this.state.isSeekTimeVisible })
  }

  // How to send a message via tooltip
  sendTooltipMessage(message, time, cb) {
    const newTime = time || 5000

    this.setState(
      {
        message,
        displayMessage: true,
      },
      () => {
        setTimeout(() => {
          this.setState(
            {
              displayMessage: false,
              message: '',
            },
            () => {
              if (cb) {
                cb()
              }
            },
          )
        }, newTime)
      },
    )
  }

  setDisplayedEntityMarkers = entities => {
    this.setState({ displayedEntityMarkers: entities })
  }

  handleEntityNavigatorSelection = selectedUnixTs => {
    this.onTimelineSelection(selectedUnixTs)
    this.setState({ shouldDefinitelyResetPlayheadInRange: true })
  }

  render() {
    const {
      hideSearchBox,
      isOnVideoWall,
      modal,
      showPlaybackControls,
      streamId,
      vms,
    } = this.props

    const { controlEffectIconName, controlEffectTimeStamp } = this.state
    const ControlEffectIcon = Icons[controlEffectIconName]

    const VIDEO_RATIO = 1.333 // 4:3 video width:height ratio
    const VIDEO_SMALL_HEIGHT = 200 // default placeholder height

    // Desktop
    const getFullScreenDimensions = (paddingPx = 0) => {
      const height = `calc(100vh - ${paddingPx}px)`
      const width = `calc(${height} * ${VIDEO_RATIO})`
      return {
        height,
        width,
      }
    }

    // Height
    // Substate for if video is loading
    const getVideoHeight = () => {
      if (isOnVideoWall) {
        if (this.state.viewState === LiveStreamComponentState.LOADING) {
          return VIDEO_SMALL_HEIGHT
        }
        return '100%'
      }
      if (isMobile) {
        const { isLandscape } = this.props
        if (isLandscape) {
          return 'calc(100vh)'
        }
        // for mobile  portrait mode, base off of width, since it is narrower, this keeps the max
        // width be based on the narrower dimension
        return `calc(100vw / ${VIDEO_RATIO})`
      }
      // In Modal
      //
      if (modal.open) {
        if (modal.type === 'ALERT') {
          return '100%'
        }
        if (modal.type === 'VIDEO') {
          if (this.props.vms.isFullscreenMode) {
            return getFullScreenDimensions(180).height
          }
          return getFullScreenDimensions(350).height
        }
      }
      return getFullScreenDimensions(350).height // just allow the default height to apply to the video in the modal.
    }

    const getPlaceholderVideoHeight = () => {
      if (isOnVideoWall) {
        return getVideoHeight()
      }
      if (modal.open) {
        if (modal.type === 'ALERT') {
          return '100%'
        }
        if (modal.type === 'VIDEO') {
          if (this.props.vms.isFullscreenMode) {
            return getFullScreenDimensions(180).height
          }
          return getFullScreenDimensions(350).height
        }
      }
      return VIDEO_SMALL_HEIGHT // default (reduce flicker)
    }

    // Width for three states - inside alert modal, in video modal, and on videowall
    // Substate for if modal is open
    const getVideoWidth = () => {
      if (isOnVideoWall) {
        if (modal.open && !showPlaybackControls) {
          // for video wall video behind open modal (so it doesn't flicker),
          // since both are video components
          return '100%'
        }
        return '100%'
      }
      if (isMobile) {
        const { isLandscape } = this.props
        if (isLandscape) {
          return `calc(100vh * ${VIDEO_RATIO})`
        }
        return 'calc(100vw)'
      }
      // In modal
      if (modal.open) {
        if (modal.type === 'ALERT') {
          return '100%'
        }
        if (modal.type === 'VIDEO') {
          if (this.props.vms.isFullscreenMode) {
            return getFullScreenDimensions(180).width
          }
          return getFullScreenDimensions(350).width
        }
      }
      return '100%'
    }

    // three parts, preview element, video element, loading element
    // loading element is displayed first, then when preview is found, the preview element is showed
    // pressing the play button displays the video element
    let previewDisplay
    let streamDisplay
    let loadingDisplay
    if (this.state.viewState === LiveStreamComponentState.LOADING) {
      loadingDisplay = 'flex'
      previewDisplay = 'none'
      streamDisplay = 'none'
    } else if (this.state.viewState === LiveStreamComponentState.STREAM) {
      loadingDisplay = 'none'
      previewDisplay = 'none'
      streamDisplay = 'flex'
    } else {
      loadingDisplay = 'none'
      previewDisplay = 'flex'
      streamDisplay = 'none'
    }

    const indicatorStatus =
      this.state.indicatorState.charAt(0).toUpperCase() +
      this.state.indicatorState.slice(1)
    const readableTSPlaying = isNaN(this.state.videoStreamTS) // eslint-disable-line
      ? formatUnixTimeToReadable(getCurrUnixTimestamp(), false, true)
      : formatUnixTimeToReadable(this.state.videoStreamTS, false, true) // eslint-disable-line

    const playButtonDisplay =
      this.props.editingVideowall === true ? 'none' : previewDisplay

    const DisconnectStatus = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
        }}
      >
        <div style={{ zIndex: 100, color: palette.common.black }}>
          <Icon icon={alertTriangle} />
        </div>
        <div style={{ color: palette.common.black }}>
          <span>{this.videoUnavailableMessage}</span>
        </div>
      </div>
    )

    // This is necessary for live streaming to work on mobile browsers.
    const MobileVideo = (
      <div
        dangerouslySetInnerHTML={{
          __html: `
              <video
                muted
                playsinline
                class="stream live-stream-placeholder"
                style="width: 100%; min-height: 200px; opacity: 1"
              />
            `,
        }}
        ref={el => {
          this.videoContainer = el
        }}
        style={{ width: '100%', height: '100%' }}
      />
    )

    const DesktopVideo = (
      <SizeMe>
        {({ size }) => {
          // size properly here
          // if (size && size.width) {
          //   console.log('size.width', size.width)
          // }
          return (
            <div
              ref={el => {
                this.videoContainer = el
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <video
                autoPlay
                muted
                className='stream live-stream-placeholder'
                playsInline
                onLoadedData={
                  this.videoElem && this.videoElem.onLoadedData
                    ? this.videoElem.onLoadedData
                    : () => {}
                }
                ref={el => (this.videoElem = el)} // eslint-disable-line
                style={{
                  opacity: this.state.loading ? 0.8 : 1,
                  width: getVideoWidth(),
                  height: getVideoHeight(),
                }}
                onMouseEnter={() =>
                  this.props.setHoverOnVideo({ id: streamId })
                }
                onMouseLeave={() =>
                  this.props.setHoverOffVideo({ id: streamId })
                }
              />
            </div>
          )
        }}
      </SizeMe>
    )

    const dimensions = this.props.vms.isFullscreenMode
      ? getFullScreenDimensions(180)
      : getFullScreenDimensions(350)
    const hasEntitySearchResults =
      this.state.displayedEntityMarkers && // potential options
      this.state.displayedEntityMarkers.length > 0 &&
      this.state.selectedEntities && // entity search box selections
      this.state.selectedEntities.length > 0

    return (
      <div
        id='vms-container'
        key={this.props.streamId + this.sessionId}
        ref={ref => {
          this.containerRef = ref
        }}
        style={{ position: 'relative' }}
      >
        {modal.open && showPlaybackControls && !hideSearchBox && (
          <div
            id='entity-search-container'
            style={{
              alignItems: 'flex-start',
              display: 'flex',
              flexDirection: 'row',
              height: 94, // hardcode to avoid thrash
              justifyContent: 'center',
              width: dimensions.width,
            }}
          >
            <span style={{ marginRight: 20 }}>
              <EntitySearch
                darkMode={vms.darkMode}
                entitySelectorOptions={this.state.entitySelectorOptions}
                handleEntitySelection={this.handleEntitySelection}
                selectedEntities={this.state.selectedEntities}
              />
            </span>
            <span
              style={{
                width: 175,
                display: hasEntitySearchResults ? 'flex' : 'none',
              }}
            >
              <EntityNavigator
                selectedEntities={this.state.selectedEntities}
                darkMode={vms.darkMode || vms.isFullscreenMode}
                data={this.state.displayedEntityMarkers}
                handleClick={this.handleEntityNavigatorSelection}
              />
            </span>
          </div>
        )}
        <div
          className='play-btn-container'
          style={{ display: `${previewDisplay}` }}
        >
          <span
            style={{
              display: `${playButtonDisplay}`,
              marginLeft: 4,
              marginTop: 3,
            }}
            onClick={this.playElem}
          >
            <Play stroke={palette.common.white} fill={palette.common.white} />
          </span>
        </div>
        <img
          className='preview full live-stream-placeholder'
          alt='Stream Preview'
          src={this.state.streamPlaceholder}
          style={{ display: `${previewDisplay}` }}
          onClick={this.playElem}
        />
        <Grid container style={{ display: `${loadingDisplay}` }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <LinearProgress />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              bgcolor='text.primary'
              style={{
                height: getPlaceholderVideoHeight(),
                width: getVideoWidth(),
              }}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <CircularProgress
                variant='determinate'
                value={this.state.signalProgress}
                color='primary'
              />
            </Box>
          </Grid>
        </Grid>
        <div
          id='vms-container'
          style={{
            background: modal.open && vms.darkMode ? 'black' : 'white',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: `${streamDisplay}`,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              width: getVideoWidth(),
              height: getVideoHeight(),
            }}
          >
            <IndicatorStatusBadge
              status={indicatorStatus}
              display={streamDisplay}
              variant='naked'
              pulseRippleColor='white'
            />
            <ControlEffect key={controlEffectTimeStamp + controlEffectIconName}>
              <ControlEffectIcon
                stroke={palette.common.white}
                fill={palette.common.white}
                height={28}
                width={28}
              />
            </ControlEffect>
            {isMobile && MobileVideo}
            {!isMobile && DesktopVideo}
            {this.disconnected && DisconnectStatus}
          </div>
          <div
            id='playback-controller-container'
            style={{ width: '100%', zIndex: 100 }}
          >
            {this.props.showPlaybackControls && (
              <PlaybackControls
                accountSlug={this.props.accountSlug}
                catalogue={this.state.catalogue}
                changeExportTSRange={this.changeExportTSRange}
                createDispatchRequest={this.createDispatchRequest}
                creatingDispatchRequest={this.creatingDispatchRequest}
                darkMode={vms.darkMode}
                dataFromTS={dataFromTS}
                datePickerSelectionTS={this.state.datePickerSelectionTS}
                daysBackAccessible={this.daysBackAccessible}
                daysWithData={this.state.daysWithData}
                displayEntitySelector={this.state.displayEntitySelector}
                displayMessage={this.state.displayMessage}
                endTimelineTS={this.state.endTimelineTS}
                entitySelectorOptions={this.state.entitySelectorOptions}
                exportEndTS={this.state.exportEndTS}
                exportStartTS={this.state.exportStartTS}
                handleDatePickerSelection={this.handleDatePickerSelection}
                handleEntitySelection={this.handleEntitySelection}
                handleExport={this.handleExport}
                handleGoLiveButton={this.handleGoLiveButton}
                handlePlayPauseButton={this.handlePlayPauseButton}
                handleStepInSeconds={this.handleStepInSeconds}
                handleEnterFullScreenVideo={this.handleEnterFullScreenVideo}
                handleExitFullScreenVideo={this.handleExitFullScreenVideo}
                initTS={this.state.initTS}
                isAlertsVisible={vms.isAlertsVisible}
                isCatalogueMissing={this.state.isCatalogueMissing}
                isDatePickerVisible={this.state.isDatePickerVisible}
                isArchiveVisible={this.state.isArchiveVisible}
                isFollowing={this.state.isFollowing}
                isFullScreenVideo={this.props.vms.isFullscreenMode}
                isHoveringOnTimeline={this.state.isHoveringOnTimeline}
                isSeekTimeVisible={this.state.isSeekTimeVisible}
                isTSWithinRetentionDays={this.isTSWithinRetentionDays}
                isZoomIn={this.state.isZoomIn}
                jumpToInitTS={this.jumpToInitTS}
                loadingArchivalVideo={this.state.loadingArchivalVideo}
                message={this.state.message}
                metadata={this.state.metadata}
                onTimelineSelection={this.onTimelineSelection}
                playbackStatus={this.state.playbackStatus}
                readableTSPlaying={readableTSPlaying}
                retention={this.state.retention}
                selectedEntities={this.state.selectedEntities}
                sendTooltipMessage={this.sendTooltipMessage}
                setDisplayedEntityMarkers={this.setDisplayedEntityMarkers}
                setInitTS={this.state.setInitTS}
                setIsFollowing={this.setIsFollowing}
                setStopFollowing={this.setStopFollowing}
                setZoomLevel={this.setZoomLevel}
                showDispatchMenu={this.state.showDispatchMenu}
                shouldDefinitelyResetPlayheadInRange={
                  this.state.shouldDefinitelyResetPlayheadInRange
                }
                setShouldDefinitelyResetPlayheadInRange={
                  this.setShouldDefinitelyResetPlayheadInRange
                }
                siteSlug={this.props.siteSlug}
                startTimelineTS={this.state.startTimelineTS}
                stopVideoElem={this.stopVideoElem}
                streamId={streamId}
                subtractDays={this.state.subtractDays}
                toggleDarkMode={this.props.toggleDarkMode}
                toggleDatePicker={this.toggleDatePicker}
                toggleDispatchMenu={this.toggleDispatchMenu}
                toggleEntitySelectorDisplay={this.toggleEntitySelectorDisplay}
                toggleExportMode={this.toggleExportMode}
                toggleSeekTime={this.toggleSeekTime}
                toggleSetInitTS={this.toggleSetInitTS}
                videoStreamTS={this.state.videoStreamTS}
                zoomLevel={this.state.zoomLevel}
              />
            )}
          </div>
          {false && (
            <div
              onClick={() =>
                this.setState({ isFollowing: !this.state.isFollowing })
              }
            >
              toggle isFOLLOWING: {this.state.isFollowing ? 'true' : 'false'}
            </div>
          )}
        </div>
      </div>
    )
  }
}

VideoStream.defaultProps = {
  accountSlug: '',
  autoReconnectAttempts: false,
  debugMode: false,
  editingVideowall: false,
  hangup: () => {},
  hideSearchBox: false,
  initTS: null,
  isLandscape: false,
  isOnVideoWall: false,
  modal: {
    open: false,
    type: null,
  },
  nodeId: null,
  previewFreq: PreviewFrequency.SLOW,
  reconnectTimeoutMs: false,
  requestCandidates: () => {},
  requestIceServers: () => {},
  sendCandidate: () => {},
  sendExportRequest: () => {},
  sendOffer: () => {},
  sessionId: null,
  setHoverOffVideo: () => {},
  setHoverOnVideo: () => {},
  setTimelineSettingPosition: () => {},
  showPlaybackControls: false,
  siteSlug: '',
  streamId: null,
  streamType: StreamTypeEnum.NORMAL,
  subscribe: () => {},
  toggleDarkMode: () => {},
  toggleFullscreenMode: () => {},
  unsubscribe: () => {},
  updateArchivalPlayTime: () => {},
  vms: VmsPropTypeDefault,
  willAutoLoad: false,
}

VideoStream.propTypes = {
  accountSlug: PropTypes.string,
  autoReconnectAttempts: PropTypes.bool,
  debugMode: PropTypes.bool,
  editingVideowall: PropTypes.bool,
  hangup: PropTypes.func,
  hideSearchBox: PropTypes.bool,
  initTS: PropTypes.number,
  isLandscape: PropTypes.bool,
  isOnVideoWall: PropTypes.bool,
  modal: PropTypes.shape({
    open: PropTypes.bool,
    type: PropTypes.string,
  }),
  nodeId: PropTypes.string,
  previewFreq: PropTypes.string,
  reconnectTimeoutMs: PropTypes.bool,
  requestCandidates: PropTypes.func,
  requestIceServers: PropTypes.func,
  sendCandidate: PropTypes.func,
  sendExportRequest: PropTypes.func,
  sendOffer: PropTypes.func,
  sessionId: PropTypes.string,
  setHoverOffVideo: PropTypes.func,
  setHoverOnVideo: PropTypes.func,
  setTimelineSettingPosition: PropTypes.func,
  showPlaybackControls: PropTypes.bool,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  streamType: PropTypes.string,
  subscribe: PropTypes.func,
  toggleDarkMode: PropTypes.func,
  toggleFullscreenMode: PropTypes.func,
  unsubscribe: PropTypes.func,
  updateArchivalPlayTime: PropTypes.func,
  vms: VmsPropType,
  willAutoLoad: PropTypes.bool,
}

const mapStateToProps = state => ({
  modal: state.modal,
  streamType: state.settings.streamType,
  vms: state.vms,
})

const mapDispatchToProps = dispatch => ({
  hangup: data => dispatch(hangupAction(data)),
  requestCandidates: data => dispatch(requestCandidatesAction(data)),
  requestIceServers: data => dispatch(requestIceServersAction(data)),
  sendCandidate: data => dispatch(sendCandidateAction(data)),
  sendExportRequest: data => dispatch(sendExportRequestAction(data)),
  sendOffer: data => dispatch(sendOfferAction(data)),
  setHoverOffVideo: data => dispatch(vmsActions.setHoverOffVideo(data)),
  setHoverOnVideo: data => dispatch(vmsActions.setHoverOnVideo(data)),
  setTimelineSettingPosition: data =>
    dispatch(vmsActions.setTimelineSettingPosition(data)),
  subscribe: (key, callback) => dispatch(subscribeAction(key, callback)),
  toggleDarkMode: data => dispatch(vmsActions.toggleDarkMode(data)),
  toggleFullscreenMode: data => dispatch(vmsActions.toggleFullscreenMode(data)),
  unsubscribe: key => dispatch(unsubscribeAction(key)),
  updateArchivalPlayTime: data => dispatch(updateArchivalPlayTimeAction(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withOrientationChange(VideoStream))
