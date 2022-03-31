/* eslint-disable no-prototype-builtins, no-console */
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
import { withApollo } from 'react-apollo'
import { withTheme } from '@material-ui/core/styles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Icons } from 'ambient_ui'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'
import get from 'lodash/get'
// src
import { createNotification as createNotificationAction } from 'redux/slices/notifications'

import constants from '../../constants'
import { StreamTypeEnum, DataChannelCodeEnum } from '../../enums'
import { makeUniqueId } from '../../utils'
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
  GET_STREAM_CATALOGUE,
  GET_META_DATA_BY_STREAM,
  DISPATCH_ALERT,
  GET_STREAM,
} from './gql'
import PreviewFrequency from './data/PreviewFrequency'
import IndicatorState from './data/IndicatorState'
import LiveStreamComponentState from './data/LiveStreamComponentState'
import EntitySubSelectionTree from './data/EntitySubSelectionTree'
import PlaybackControls from './components/PlaybackControls/PlaybackControls'
import PlaybackStatus from './data/PlaybackStatus'
import getCurrUnixTimestamp from './utils/getCurrUnixTimestamp'
import formatUnixTimeToReadable from './utils/formatUnixTimeToReadable'
import tsAtMidnight from './utils/tsAtMidnight'
import LoadingBackground from './LoadingBackground.png'

import './index.css'

const { Play } = Icons

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
    return a.startTs - b.startTs
  })
  let minIndex = 0
  let maxIndex = arr.length - 1
  let currentIndex
  let currentElement

  while (minIndex <= maxIndex) {
    currentIndex = ((minIndex + maxIndex) / 2) | 0 // eslint-disable-line
    currentElement = arr[currentIndex]
    if (searchedTs > currentElement.endTs / 1000) {
      minIndex += 1
    } else if (searchedTs < currentElement.startTs / 1000) {
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
      currDiff = Math.abs(searchedTs - arr[i].startTs / 1000)
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
    this.pollCandidatesIntervalMs = 500
    this.pollCandidatesAttempts = 0
    this.pollCandidatesMaxAttempts = 15
    this.iceConnectionHealthTimeoutMs = 15000
    this.iceServersResponseTimeoutMs = 10000
    this.offerResponseTimeoutMs = 5000
    this.sdpAnswerAccepted = false
    this.attemptNumber = 0
    this.candidates = []
    this.waiting = false
    this.playing = false
    this.daysBackAccessible = 31

    // Amount of width increment timeline view when playing
    this.streamClockInterval = null

    // Store needed for getting last location to move progress bar
    this.lastUnixTs = null
    this.lastWidthOfClickInDecimal = null
    this.nextPlaybackStatus = PlaybackStatus.LIVE

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

    this.state = {
      viewmode: this.props.streamType.toLowerCase(),
      viewState: initView,
      streamPlaceholder: null,
      src: '',
      indicatorState: IndicatorState.DISCONNECTED,
      playbackStatus: PlaybackStatus.LIVE,
      progressBarWidth: 100,
      videoStreamTS: currTS,
      startTimelineTS,
      endTimelineTS: currTS,
      isHoveringOnTimeline: false,
      thumbnailDate: '',
      mouseIndicatorX: null,
      mouseIndicatorY: null,
      playbackTimeWindow: 24 * 3600,
      progressBarWidthIncrement: 100 / (24 * 3600),
      displayTimeWindowIndicator: false,
      loading: false,
      isDatePickerVisible: false,
      datePickerSelection: getCurrUnixTimestamp(),
      viewWindowIncrementSize: 10,
      exportMode: false,
      isFollowing: false,
      loadingArchivalVideo: true,
      subtractDays: 0, // days from today aka 0 = today
      message: '', // Loading Timeline Before Displaying
      displayMessage: false, // Loading Timeline
      daysWithData: [],
      isZoomIn: 0, // Keep this as 0. If you want to zoom in on load use isZoomInInit. Waits for all component to load for transition
      displayEntitySelector: false,
      metadata: [],
      selectedEntities: [],
      showSeekInputDisplay: false,
      retention: {},
      setInitTS: false,
      catalogue: [],
      showDispatchMenu: false,
      creatingDispatchRequest: false,
      entitiesOnly: false,
      initTS: props.initTS
        ? props.initTS - constants.ALERT_EVENT_ADJUSTMENT
        : null,
      // From 0 to 100
      signalProgress: 0,
      placeholderLoaded: false,
    }

    this.exportStartTS = null
    this.exportEndTS = null
    this.videoElem = null
    this.videoContainer = null

    this.toggleEntitiesOnly = this.toggleEntitiesOnly.bind(this)
    this.init = this.init.bind(this)
    this.fetchPreview = this.fetchPreview.bind(this)
    this.signal = this.signal.bind(this)
    this.createPeerConnection = this.createPeerConnection.bind(this)
    this.sendCandidates = this.sendCandidates.bind(this)
    this.acceptAnswer = this.acceptAnswer.bind(this)
    this.stopPollingForCandidates = this.stopPollingForCandidates.bind(this)
    this.onTrack = this.onTrack.bind(this)
    this.addIceCandidates = this.addIceCandidates.bind(this)
    this.resetOfferResponseTimeout = this.resetOfferResponseTimeout.bind(this)
    this.onOfferResponseTimeout = this.onOfferResponseTimeout.bind(this)
    this.createOffer = this.createOffer.bind(this)
    this.startPollingForCandidates = this.startPollingForCandidates.bind(this)
    this.onDataChannelMessage = this.onDataChannelMessage.bind(this)
    this.iceConnectionStateConnected = this.iceConnectionStateConnected.bind(
      this,
    )
    this.iceConnectionStateClosed = this.iceConnectionStateClosed.bind(this)
    this.iceConnectionFailed = this.iceConnectionFailed.bind(this)
    this.changeViewMode = this.changeViewMode.bind(this)
    this.playElem = this.playElem.bind(this)
    this.onIceServersResponseTimeout = this.onIceServersResponseTimeout.bind(
      this,
    )
    this.disconnect = this.disconnect.bind(this)
    this.requestCandidates = this.requestCandidates.bind(this)
    this.checkToCallPlayAgain = this.checkToCallPlayAgain.bind(this)
    this.onIceConnectionStateChange = this.onIceConnectionStateChange.bind(this)
    this.onReceivingIceServers = this.onReceivingIceServers.bind(this)
    this.showView = this.showView.bind(this)
    this.updateArchivalPlayTime = this.updateArchivalPlayTime.bind(this)

    this.toggleSetInitTS = this.toggleSetInitTS.bind(this)
    this.isTSWithinRetentionDays = this.isTSWithinRetentionDays.bind(this)

    // Playback controls functions
    this.handlePlayPauseButton = this.handlePlayPauseButton.bind(this)
    this.handleGoLiveButton = this.handleGoLiveButton.bind(this)
    this.handleStepBackwards = this.handleStepBackwards.bind(this)
    this.handleStepForwards = this.handleStepForwards.bind(this)
    this.handleExport = this.handleExport.bind(this)
    this.onTimelineSelection = this.onTimelineSelection.bind(this)
    this.onTimelineSelectionContinued = this.onTimelineSelectionContinued.bind(
      this,
    )
    this.getWidthOfClickInDecimal = this.getWidthOfClickInDecimal.bind(this)
    this.onTimelineHover = this.onTimelineHover.bind(this)
    this.onTimelineLeave = this.onTimelineLeave.bind(this)
    this.getWidthByTSDiff = this.getWidthByTSDiff.bind(this)
    this.getTimestampOfMouse = this.getTimestampOfMouse.bind(this)
    this.stopPlayerClock = this.stopPlayerClock.bind(this)
    this.startPlayerClock = this.startPlayerClock.bind(this)
    this.toggleDatePicker = this.toggleDatePicker.bind(this)
    this.handleDatePickerSelection = this.handleDatePickerSelection.bind(this)
    this.isCurrentDay = this.isCurrentDay.bind(this)
    this.changeExportTSRange = this.changeExportTSRange.bind(this)
    this.noLongerFollowing = this.noLongerFollowing.bind(this)
    this.handleZoom = this.handleZoom.bind(this)

    this.preInit = this.preInit.bind(this)
    this.getCatalogueData = this.getCatalogueData.bind(this)
    this.getMetadata = this.getMetadata.bind(this)
    this.handleExportMode = this.handleExportMode.bind(this)
    this.toggleEntitySelectorDisplay = this.toggleEntitySelectorDisplay.bind(
      this,
    )

    this.stopVideoElem = this.stopVideoElem.bind(this)

    this.handleEntitySelection = this.handleEntitySelection.bind(this)

    this.toggleSeekInputDisplay = this.toggleSeekInputDisplay.bind(this)

    this.sendTooltipMessage = this.sendTooltipMessage.bind(this)

    // Dispatch Menu
    this.toggleDispatchMenu = this.toggleDispatchMenu.bind(this)
    this.createDispatchRequest = this.createDispatchRequest.bind(this)
    this.archivePage = this.archivePage.bind(this)

    this.preInit()
  }

  createDispatchRequest(title, ts, callback) {
    this.setState(
      {
        creatingDispatchRequest: true,
      },
      () => {
        const { accountSlug, siteSlug, streamId } = this.props

        return this.props.client.mutate({
          mutation: DISPATCH_ALERT,
          variables: {
            accountSlug,
            siteSlug,
            streamId: Number(streamId),
            ts: Math.floor(ts).toString(),
            name: title,
          },
        })
      },
    )
  }

  toggleDispatchMenu() {
    this.setState({
      showDispatchMenu: !this.state.showDispatchMenu,
      isDatePickerVisible: false,
    })
  }

  toggleEntitySelectorDisplay() {
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

  componentDidUpdate(prevProps) {
    // recreate life cycle if stream was updated
    if (prevProps.streamId !== this.props.streamId) this.updateWithNewStream()

    // eslint-disable-next-line prefer-destructuring
    this.videoElem = this.videoContainer.children[0]
    this.videoElem.onLoadedData = () => {
      this.setState({
        signalProgress: 100,
      })
      this.stopPollingForCandidates(() => {
        // video started playing
        if (this.healthTimeoutId) {
          clearTimeout(this.healthTimeoutId)
          this.healthTimeoutId = null
        }
        this.showView(
          LiveStreamComponentState.STREAM,
          IndicatorState.LIVE,
          () => {
            const now = new Date().getTime()
            console.debug(
              `[peerConnId=${
                this.peerConnId
              }] time taken to video.onloadeddata event: ${now -
                this.handshakeStartTimestampMs} ms`,
            )
          },
        )
      })
    }
  }

  componentDidMount() {
    this.props.subscribe(this.sessionId, data => {
      this.onMessage(data)
    })
    // Always signal immediately
    this.signal()
  }

  handleExportMode() {
    this.setState({
      exportMode: !this.state.exportMode,
    })
  }

  isTSWithinRetentionDays(unixTs) {
    // Check how many days from now to that day
    // If less or equal to retention days then return true
    const diffDays = daysFromNow(unixTs)
    return get(this.state, 'retention.motionSegmentRetentionDays')
      ? diffDays < get(this.state, 'retention.motionSegmentRetentionDays')
      : diffDays < get(this.state, 'retention.retentionDays')
  }

  preInit() {
    // check to see if you need to Get Catalogue
    if (this.props.showPlaybackControls) {
      const midnightTS = tsAtMidnight()
      const nextTS = midnightTS + 3600 * 24
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
              if (this.props.isZoomInInit) {
                // Hack to only zoom on load if timeline
                setTimeout(() => {
                  this.handleZoom(this.props.isZoomInInit)
                }, 2000)
              }
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
        this.setState(
          {
            indicatorState: IndicatorState.LIVE,
            setInitTS: false,
          },
          () => {
            this.sendTooltipMessage(
              "Alert Instance's timestamp is older than Appliance's retention days",
              5000,
              () => {
                this.init()
              },
            )
          },
        )
      }
    } else {
      this.init()
    }
  }

  toggleSetInitTS(callback) {
    const newState = {
      setInitTS: !this.state.setInitTS,
    }
    this.setState(newState, () => {
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

  stopVideoElem() {
    this.handlePlayPauseButton()
  }

  playElem(evt) {
    if (this.videoElem && (this.videoElem.src || this.videoElem.srcObject)) {
      this.videoElem
        .play()
        .then(() => {
          // Check for frame
          this.showView(LiveStreamComponentState.STREAM, IndicatorState.LIVE)
        })
        .catch(err => {
          console.error(`Error playing stream: ${err}`)
          this.iceConnectionFailed()
        })
    }
  }

  fetchPreview() {
    const { streamId, modelType, modelId, modelHash } = this.props
    const variables = {
      streamId: Number(streamId),
    }

    // Enables viewing stream from nonauthenticated mobile pages
    if (modelType && modelId && modelHash) {
      variables.modelType = modelType
      variables.modelId = modelId
      variables.modelHash = modelHash
    }

    return this.props.client
      .query({
        query: GET_STREAM,
        variables,
      })
      .then(response => {
        const data = get(response, 'data.getStream')
        if (data.error) {
          console.warn('failed to fetch preview', get(data, 'error'))
          return
        }
        // Update placeholder
        this.setState({
          streamPlaceholder: get(data, 'snapshot.dataStr'),
        })
      })
      .catch(err => {
        console.warn('failed to fetch preview', err)
      })
  }

  // onReceivingIceServers() - calls creation of peer connection and sets it to state along with other data
  onReceivingIceServers(iceservers) {
    this.resetIceServersResponseTimeout()
    this.pc = this.createPeerConnection(iceservers)
    this.pc.peerid = this.peerConnId
    this.createOffer()
    // set timeout to check if webrtc connection got established
    if (this.iceConnectionHealthTimeoutId) {
      clearTimeout(this.iceConnectionHealthTimeoutId)
      this.iceConnectionHealthTimeoutId = null
    }

    this.iceConnectionHealthTimeoutId = setTimeout(() => {
      if (
        this.pc === null ||
        (this.playing &&
          this.pc.iceConnectionState !== 'connected' &&
          this.pc.iceConnectionState !== 'completed')
      ) {
        console.log('iceConnection not yet established, restarting stream')
        const streamMessage = this.props.streamName
          ? `stream ${this.props.streamName}`
          : 'stream'
        this.props.createNotification(
          `Unable to fetch video from ${streamMessage}. Retrying connection...`,
        )
        this.iceConnectionStateClosed()
      }
    }, this.iceConnectionHealthTimeoutMs)
  }

  sendCandidates() {
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
    this.candidates = []
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
        const streamTS = Math.floor(get(data, ['data', streamKey], 0) / 1000)
        // console.log(`Tick of ${streamId} at ${streamTS}, video at ${this.state.videoStreamTS}`)
        if (
          Math.abs(streamTS - this.state.videoStreamTS) > 2 &&
          this.state.playbackStatus !== PlaybackStatus.PAUSED
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
    }
  }

  // onMessage() - receives messages and parses it
  onMessage(message) {
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
        console.debug(JSON.stringify(answer))
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
        // console.debug(
        //   `[peerConnId=${this.peerConnId}] stream failed reason=${message.data.error}, disconnecting and replaying`,
        // )
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
      } else {
        this.iceConnectionFailed()
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
          console.debug(JSON.stringify(sessionDescription))
          this.resetOfferResponseTimeout()
          return this.pc.setLocalDescription(sessionDescription)
        })
        .then(() => {
          this.offerResponseTimeoutId = setTimeout(
            this.onOfferResponseTimeout,
            this.offerResponseTimeoutMs,
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
          console.error(`Create offer error: ${JSON.stringify(error)}`)
          this.iceConnectionFailed()
        })
    } catch (error) {
      console.error(`Create offer error: ${JSON.stringify(error)}`)
      this.iceConnectionFailed()
    }
  }

  requestCandidates() {
    console.debug(`[peerConnId=${this.peerConnId}] Requesting candidates.`)
    this.props.requestCandidates({
      viewmode: this.state.viewmode,
      nodeId: this.props.nodeId,
      sessionId: this.props.sessionId,
      peerConnId: this.peerConnId,
      streamId: this.props.streamId,
    })
    this.pollCandidatesAttempts += 1
    if (this.pollCandidatesAttempts >= this.pollCandidatesMaxAttempts) {
      this.stopPollingForCandidates()
    }
  }

  startPollingForCandidates() {
    // keep polling for ice candidates
    this.stopPollingForCandidates()
    // Immediately request and start a timer
    this.requestCandidates()
    this.pollCandidatesIntervalId = setInterval(
      this.requestCandidates,
      this.pollCandidatesIntervalMs,
    )
  }

  stopPollingForCandidates() {
    this.pollCandidatesAttempts = 0
    if (this.pollCandidatesIntervalId) {
      clearInterval(this.pollCandidatesIntervalId)
      this.pollCandidatesIntervalId = null
    }
  }

  acceptAnswer(sdpAnswer) {
    this.resetOfferResponseTimeout()
    // If no available Shared memory readers, show user and
    // retry connection for a newly open slot.
    if (get(sdpAnswer, 'shm_error')) {
      this.waiting = true
      this.iceConnectionFailed()
    } else if (this.pc) {
      this.waiting = false
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
    } else {
      this.iceConnectionFailed()
    }
  }

  iceConnectionFailed() {
    this.disconnect()
    this.resetIceServersResponseTimeout()
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = null
    }

    // reconnect mechanism
    this.attemptNumber += 1
    console.log(
      `${this.peerConnId}: Connection attempt ${this.attemptNumber}: wait ${this.reconnectTimeoutMs} ms`,
    )
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

  iceConnectionStateConnected() {
    // makes video element style more opaque
    // let videoElement = this.getVideoElem();
    this.resetIceServersResponseTimeout()
    if (this.videoElem) {
      this.videoElem.style.opacity = '1.0'
    }

    this.attemptNumber = 0
    this.reconnectTimeoutMs = 1000
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
  }

  isCurrentDay() {
    return getCurrUnixTimestamp() - this.state.datePickerSelection < 3600 * 24
  }

  showView(viewType, indicatorState, callback) {
    // updates the view type and the indicator status
    const newState = {}

    if (indicatorState) {
      newState.indicatorState = indicatorState
    }
    // Switching to Live
    if (this.nextPlaybackStatus === PlaybackStatus.LIVE) {
      newState.indicatorState = IndicatorState.LIVE
      newState.progressBarWidth = 100
      newState.videoStreamTS = getCurrUnixTimestamp()
      // when playing LIVE keep updaing value
    } else if (this.nextPlaybackStatus === PlaybackStatus.PLAYING) {
      newState.videoStreamTS = this.lastUnixTs
      newState.indicatorState = IndicatorState.RECORDED
      newState.playbackStatus = this.nextPlaybackStatus
    } else if (this.lastPlaybackStatus === PlaybackStatus.LIVE) {
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

      if (callback) {
        callback()
      }
    })
  }

  iceConnectionStateClosed() {
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

  onIceConnectionStateChange(pc, evt) {
    console.log(
      `[peerConnId=${this.peerConnId}] iceConnectionState changed to: ${pc.iceConnectionState}`,
    )

    // let videoElement = this.getVideoElem();
    if (pc.iceConnectionState === 'connected') {
      this.ts_first_byte = new Date().getTime()
      this.iceConnectionStateConnected()
    } else if (pc.iceConnectionState === 'disconnected') {
      pc.restartIce()
      if (pc.connectionState !== 'connected') {
        this.iceConnectionStateClosed()
      }
    } else if (
      pc.iceConnectionState === 'failed' ||
      pc.iceConnectionState === 'closed'
    ) {
      this.iceConnectionStateClosed()
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
        // eslint-disable-line
        // eslint-disable-line
        server = JSON.parse(JSON.stringify(server))
        server.urls = server.url
      }
      newIceServers.push(server)
    }

    const config = { iceServers: newIceServers }
    const pc = new RTCPeerConnection(config, options)
    // NB: IMPORTANT: This line is necessary for streaming to work
    // on mobile devices. If you remove this line, you'll get
    // incomplete offers that lead to 0 candidates gathered.
    // Reference: https://github.com/AmbientAI/product/pull/156/files
    // DO NOT REMOVE.
    pc.addTransceiver('video')
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

  // disconnects video stream
  disconnect() {
    // console.info(`Video stream disconnected for peerConnId=${this.peerConnId}`)

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
      // This leads to a 'destroy'ed stream to immediately start again due to the reconnect attempts in this method.
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
      // Array destructuring. If more than one stream, take first
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
        this.iceConnectionStateClosed()
        return null
      }
    }
    // if archival
    if (this.nextPlaybackStatus === PlaybackStatus.PLAYING) {
      this.updateArchivalPlayTime(this.lastUnixTs)
    }
    if (this.props.willAutoLoad) {
      this.playElem()
    }
    return null
  }

  changeViewMode(viewmode, callback) {
    if (this.state.viewmode !== viewmode) {
      this.setState(
        {
          viewmode,
        },
        () => {
          this.disconnect()
          this.init()
          this.signal()
          if (callback) {
            callback()
          }
        },
      )
    } else if (callback) {
      callback()
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

  signal() {
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
      this.iceServersResponseTimeoutMs,
    )
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

  updateArchivalPlayTime(ts) {
    this.props.updateArchivalPlayTime({
      streamId: this.props.streamId,
      uniqId: this.peerConnId,
      nodeId: this.props.nodeId,
      sessionId: this.props.sessionId,
      ts: ts * 1000,
    })
  }

  archivePage() {
    window.location.href = `/accounts/${this.props.accountSlug}/history/archives`
  }

  handleExport() {
    let tip
    // Check if catalogue data exists
    if (this.exportStartTS !== null && this.exportEndTS !== null) {
      const currTS = new Date().getTime() / 1000

      if (this.exportStartTS <= currTS || this.exportEndTS <= currTS) {
        tip = (
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
        // some fetch request
        // Used for creation of video export file name. Adding both stream id and start and end ts.
        const uniq = makeUniqueId()
        // console.log(
        //   `[Archival] Requesting export for startTs=${this.exportStartTS}, endTs=${this.exportEndTS}, uniq=${uniq}`,
        // )
        this.props.sendExportRequest({
          streamId: this.props.streamId,
          // TODO: DOS possibility. Machine Perception Team wanted exported videos to contain stream id and the start and end time stamps.
          // Math.floor is needed because video exports URL does not take in decimal so must be a round number
          uniqId: `${uniq}-${this.props.streamId}-${Math.floor(
            this.exportStartTS,
          )}-${Math.floor(this.exportEndTS)}`,
          nodeId: this.props.nodeId,
          sessionId: this.props.sessionId,
          startTs: this.exportStartTS * 1000,
          endTs: this.exportEndTS * 1000,
        })
        this.handleExportMode()
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
    this.sendTooltipMessage(tip, 5000)
  }

  changeExportTSRange(startTs, endTs) {
    this.exportStartTS = startTs
    this.exportEndTS = endTs
  }

  stopPlayerClock() {
    if (this.streamClockInterval) {
      clearInterval(this.streamClockInterval)
      this.streamClockInterval = null
    }
  }

  startPlayerClock() {
    if (!this.streamClockInterval) {
      this.streamClockInterval = setInterval(() => {
        const newClockState = {}
        if (this.nextPlaybackStatus === PlaybackStatus.LIVE) {
          newClockState.videoStreamTS = getCurrUnixTimestamp()
          newClockState.endTimelineTS = getCurrUnixTimestamp()
        } else if (this.nextPlaybackStatus === PlaybackStatus.PLAYING) {
          newClockState.videoStreamTS = this.state.videoStreamTS + 1
          newClockState.progressBarWidth =
            this.state.progressBarWidth + this.state.progressBarWidthIncrement
        }
        this.setState(newClockState, () => {})
      }, 1000)
    }
  }

  handlePlayPauseButton() {
    const newState = {}
    if (this.state.playbackStatus === PlaybackStatus.LIVE) {
      newState.playbackStatus = PlaybackStatus.PAUSED
      // newState.indicatorState = IndicatorState.RECORDED;

      this.lastPlaybackStatus = PlaybackStatus.LIVE
      this.timestampBeforeRecorded = getCurrUnixTimestamp()
      this.videoElem.play().then(() => {
        this.videoElem.pause()
      })
      this.stopPlayerClock()
    } else if (this.state.playbackStatus === PlaybackStatus.PAUSED) {
      if (this.lastPlaybackStatus === PlaybackStatus.LIVE) {
        this.nextPlaybackStatus = PlaybackStatus.LIVE
        newState.playbackStatus = PlaybackStatus.LIVE
        this.startPlayerClock()
        this.videoElem.play()
      } else {
        this.startPlayerClock()
        this.onTimelineSelectionContinued(this.lastUnixTs)
      }
    } else if (this.state.playbackStatus === PlaybackStatus.PLAYING) {
      this.lastPlaybackStatus = PlaybackStatus.PLAYING
      newState.playbackStatus = PlaybackStatus.PAUSED
      this.lastUnixTs = this.state.videoStreamTS
      this.videoElem.play().then(() => {
        this.videoElem.pause()
      })
      this.stopPlayerClock()
    }
    this.setState(newState, () => {})
  }

  handleGoLiveButton() {
    const newState = {
      isFollowing: true,
      subtractDays: 0,
    }
    if (this.state.playbackStatus !== PlaybackStatus.LIVE) {
      const midnightTS = tsAtMidnight()
      const nextTS = midnightTS + 3600 * 24
      this.getCatalogueData(midnightTS, nextTS, (catalogue, daysWithData) => {
        this.setState(
          {
            catalogue,
            daysWithData,
            loadingArchivalVideo: false,
          },
          () => {
            this.nextPlaybackStatus = PlaybackStatus.LIVE
            this.changeViewMode(StreamTypeEnum.NORMAL, () => {
              if (this.state.playbackStatus !== PlaybackStatus.LIVE) {
                const curr = new Date()
                curr.setHours(0, 0, 0, 0)
                const startTimelineTS = Math.round(curr.getTime() / 1000)
                const unixTs = getCurrUnixTimestamp()
                newState.playbackStatus = PlaybackStatus.LIVE
                newState.datePickerSelection = unixTs
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

  handleStepBackwards() {
    const unixTs = this.state.videoStreamTS - 5
    const widthOfClickInDecimal = this.getWidthByTSDiff(unixTs) / 100

    this.lastUnixTs = unixTs
    this.lastWidthOfClickInDecimal = widthOfClickInDecimal

    if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
      this.nextPlaybackStatus = PlaybackStatus.PLAYING
      this.changeViewMode(StreamTypeEnum.RECORDED, () => {})
    } else {
      this.onTimelineSelectionContinued(unixTs)
    }
  }

  handleStepForwards() {
    const newVideoStreamTS = this.state.videoStreamTS + 5
    const currTS = getCurrUnixTimestamp()

    // Turns to Live
    if (newVideoStreamTS >= currTS) {
      this.handleGoLiveButton()
    } else {
      this.updateArchivalPlayTime(newVideoStreamTS)
      const newState = {}
      newState.videoStreamTS = newVideoStreamTS
      newState.progressBarWidth = this.getWidthByTSDiff(newVideoStreamTS)
      this.setState(newState, () => {})
    }
  }

  // This is the main method that starts the archival stream
  onTimelineSelection(unixTs) {
    this.lastUnixTs = unixTs

    // used to set a max when in recorded/archival state
    if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
      this.nextPlaybackStatus = PlaybackStatus.PLAYING
      this.timestampBeforeRecorded = getCurrUnixTimestamp()

      this.changeViewMode(StreamTypeEnum.RECORDED, () => {
        this.onTimelineSelectionContinued(unixTs)
      })
    } else {
      this.onTimelineSelectionContinued(unixTs)
    }
  }

  getWidthOfClickInDecimal(evt) {
    const mouseX = evt.clientX
    const boundingRect = this.timelineContainer.getBoundingClientRect()
    // subtract mouseX location from left most edge of timeline view to get difference
    return (
      (mouseX - boundingRect.left) / (boundingRect.right - boundingRect.left)
    )
  }

  // used to get the timestamp of a click or hover event
  getTimestampOfMouse(widthOfClickInDecimal) {
    const latestTS =
      this.state.playbackStatus === PlaybackStatus.LIVE
        ? getCurrUnixTimestamp()
        : this.timestampBeforeRecorded
    const diffTSOfEarliestToCurr = latestTS - this.state.startTimelineTS
    const diffOfClick = diffTSOfEarliestToCurr * widthOfClickInDecimal

    return Math.max(
      Math.round(this.state.startTimelineTS + diffOfClick),
      this.state.startTimelineTS,
    )
  }

  onTimelineSelectionContinued(unixTs, callback) {
    this.updateArchivalPlayTime(unixTs)
    this.stopPlayerClock()

    const newState = {}
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
    newState.videoStreamTS = unixTs
    newState.indicatorState = IndicatorState.RECORDED
    newState.playbackStatus = PlaybackStatus.PLAYING
    newState.isFollowing = false
    this.videoElem.play()
    this.startPlayerClock()

    this.setState(newState, () => {
      if (callback) {
        callback()
      }
    })
  }

  onTimelineHover(evt) {
    const widthOfClickInDecimal = this.getWidthOfClickInDecimal(evt)
    const unixTs = this.getTimestampOfMouse(widthOfClickInDecimal)
    const readableDate = formatUnixTimeToReadable(unixTs, false, true)

    // Used to center the thumbnail box
    const timelineContainerBoundingBox = this.timelineContainer.getBoundingClientRect()
    const mouseIndicatorX = evt.clientX - timelineContainerBoundingBox.left
    const mouseIndicatorY = evt.clientY - timelineContainerBoundingBox.top

    // used to get rid of weird hover bug
    if (mouseIndicatorX <= timelineContainerBoundingBox.right) {
      this.setState(
        {
          isHoveringOnTimeline: true,
          thumbnailDate: readableDate,
          mouseIndicatorY,
          mouseIndicatorX,
        },
        () => {},
      )
    }
  }

  onTimelineLeave() {
    this.setState({
      isHoveringOnTimeline: false,
    })
  }

  getWidthByTSDiff(unixTS) {
    const curr = getCurrUnixTimestamp()
    const earliest = curr - Number(this.state.playbackTimeWindow)
    const diff = unixTS - earliest
    return (diff / Number(this.state.playbackTimeWindow)) * 100
  }

  toggleDatePicker(callback) {
    this.setState(
      {
        isDatePickerVisible: !this.state.isDatePickerVisible,
        showDispatchMenu: false,
      },
      () => {
        if (callback && typeof callback === 'function') {
          callback()
        }
      },
    )
  }

  getCatalogueData(startDate, endDate, callback) {
    const { accountSlug, siteSlug, streamId } = this.props
    this.props.client
      .query({
        query: GET_STREAM_CATALOGUE,
        variables: {
          accountSlug,
          siteSlug,
          streamId: Number(streamId),
          startTs: startDate,
          endTs: endDate,
        },
      })
      .then(result => {
        const { data } = result

        if (callback) {
          callback(
            get(data, 'streamCatalogue.catalogue'),
            get(data, 'streamCatalogue.availableDays'),
            get(data, 'streamCatalogue.entitySelections'),
            get(data, 'streamCatalogue.retention'),
          )
        }
      })
  }

  getMetadata(startDate, endDate, callback) {
    const { accountSlug, siteSlug, streamId } = this.props
    const queryString = this.state.selectedEntities.map(el => {
      return `${el.type}_${el.label}`
    })

    this.setState(
      {
        displayMessage: true,
        message: 'Loading Entities...',
      },
      () => {
        this.props.client
          .query({
            query: GET_META_DATA_BY_STREAM,
            variables: {
              accountSlug,
              siteSlug,
              startTs: startDate,
              endTs: endDate,
              streamId,
              metadataTypes: queryString,
            },
          })
          .then(result => {
            const metadata = get(result, 'data.metadataByStream.metadata')
            this.setState(
              {
                displayMessage: false,
                message: '',
                metadata,
              },
              () => {
                if (callback) {
                  callback(metadata)
                }
              },
            )
          })
      },
    )
  }

  // subtractDays are always the days from today
  handleDatePickerSelection(subtractDays, selectedDate, isAlertJump, callback) {
    const curr = new Date()
    curr.setHours(0, 0, 0, 0)
    const startTimelineTS =
      Math.round(curr.getTime() / 1000) - 3600 * 24 * subtractDays
    const endTimelineTS = startTimelineTS + 3600 * 24 - 1
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
              datePickerSelection: startTimelineTS,
              startTimelineTS,
              endTimelineTS,
              loadingArchivalVideo: false,
              subtractDays: 0,
            },
            () => {
              this.handleGoLiveButton()
              if (this.state.selectedEntities.length > 0) {
                this.getMetadata(startTimelineTS, endTimelineTS, () => {
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
          // Check if catalogue exists. If so it will start at earliest clip on transition.
          // Else if it is nonmotion retention data, then start at beginning of timeline.
          let startingTS =
            catalogue.length > 0 ? catalogue[0].startTs / 1000 : startTimelineTS
          if (isAlertJump) {
            startingTS = selectedDate
          }

          this.lastUnixTs = startingTS
          this.setState(
            {
              videoStreamTS: startingTS,
              catalogue,
              daysWithData,
              datePickerSelection: startTimelineTS,
              startTimelineTS,
              endTimelineTS,
              loadingArchivalVideo: false,
              subtractDays,
            },
            () => {
              if (this.state.selectedEntities.length > 0) {
                this.getMetadata(startTimelineTS, endTimelineTS, () => {
                  if (this.state.viewmode !== StreamTypeEnum.RECORDED) {
                    //                    this.videoElem.pause()
                    this.nextPlaybackStatus = PlaybackStatus.PLAYING
                    this.timestampBeforeRecorded = getCurrUnixTimestamp()
                    this.changeViewMode(StreamTypeEnum.RECORDED, () => {
                      //                      this.videoElem.pause()
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
                //                this.videoElem.pause()
                this.nextPlaybackStatus = PlaybackStatus.PLAYING
                this.timestampBeforeRecorded = getCurrUnixTimestamp()
                this.changeViewMode(StreamTypeEnum.RECORDED, () => {
                  //                  this.videoElem.pause()
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

  toggleEntitiesOnly() {
    this.setState({
      entitiesOnly: !this.state.entitiesOnly,
    })
  }

  handleEntitySelection(selection) {
    const newState = {}
    if (!this.state.entitiesOnly) {
      // Determine how many selections were made.
      const level = get(selection, 'length', 0)
      // If 1 get level 1 tree (interactions or props)
      // If 2 get level 2 (interactions objects)

      // TODO: @rodaan - Currently structured to only 3 levels for now
      //  Will need to set up to be more flexible for now
      let entitySelectorOptions
      if (level === 0) {
        entitySelectorOptions = this.originalEntities
        this.subTree = EntitySubSelectionTree
      } else if (level === 1) {
        // Initial entities come from DB
        this.subTree = EntitySubSelectionTree[selection[0].label]
        entitySelectorOptions = this.subTree.options
        this.subTree = this.subTree.options
      } else if (level === 2) {
        const last = selection[level - 1]
        // Rest come from EntitySubSelection Tree
        entitySelectorOptions = this.subTree[last.idx].options
      }

      newState.entitySelectorOptions = entitySelectorOptions
    }

    newState.selectedEntities = selection || []

    // Create model based on selections
    this.setState(newState, () => {
      if (this.state.selectedEntities.length > 0) {
        this.getMetadata(
          this.state.startTimelineTS,
          this.state.endTimelineTS,
          metadata => {},
        )
      }
    })
  }

  noLongerFollowing() {
    this.setState({ isFollowing: false })
  }

  nowFollowing() {
    this.setState({ isFollowing: true })
  }

  handleZoom(val) {
    this.setState(
      {
        isZoomIn: val,
      },
      () => {},
    )
  }

  toggleSeekInputDisplay() {
    this.setState({
      showSeekInputDisplay: !this.state.showSeekInputDisplay,
    })
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

  onPlaceholderLoadHandler = () => {}

  onPlaceholderErrorHandler = () => {}

  render() {
    // three parts, preview element, video element, loading element
    // loading element is displayed first, then when preview is found, the preview element is showed
    // pressing the play button displays the video element
    let previewDisplay
    let streamDisplay
    let loadingDisplay
    let waitingDisplay
    if (this.state.viewState === LiveStreamComponentState.LOADING) {
      loadingDisplay = 'flex'
      previewDisplay = 'none'
      streamDisplay = 'none'
    } else if (this.state.viewState === LiveStreamComponentState.STREAM) {
      loadingDisplay = 'none'
      previewDisplay = 'none'
      streamDisplay = 'inline-block'
    } else {
      loadingDisplay = 'none'
      previewDisplay = 'inline-block'
      streamDisplay = 'none'
    }
    if (this.waiting) {
      loadingDisplay = 'none'
      previewDisplay = 'none'
      streamDisplay = 'none'
      waitingDisplay = 'inline-block'
    } else {
      waitingDisplay = 'none'
    }

    const indicatorStatus =
      this.state.indicatorState.charAt(0).toUpperCase() +
      this.state.indicatorState.slice(1)
    const readableTSPlaying = isNaN(this.state.videoStreamTS) // eslint-disable-line
      ? formatUnixTimeToReadable(getCurrUnixTimestamp(), false, true)
      : formatUnixTimeToReadable(this.state.videoStreamTS, false, true) // eslint-disable-line
    const readableDate = isNaN(this.state.datePickerSelection) // eslint-disable-line
      ? formatUnixTimeToReadable(getCurrUnixTimestamp(), true, false)
      : formatUnixTimeToReadable(this.state.datePickerSelection, true, false) // eslint-disable-line

    const playbackControlsDisplay = this.props.showPlaybackControls ? (
      <PlaybackControls
        streamId={this.props.streamId}
        handleGoLiveButton={this.handleGoLiveButton}
        handlePlayPauseButton={this.handlePlayPauseButton}
        handleExport={this.handleExport}
        playbackStatus={this.state.playbackStatus}
        progressBarWidth={this.state.progressBarWidth}
        videoStreamTS={this.state.videoStreamTS}
        onTimelineSelection={this.onTimelineSelection}
        onTimelineHover={this.onTimelineHover}
        onTimelineLeave={this.onTimelineLeave}
        isHoveringOnTimeline={this.state.isHoveringOnTimeline}
        thumbnailDate={this.state.thumbnailDate}
        readableTSPlaying={readableTSPlaying}
        readableDate={readableDate}
        isDatePickerVisible={this.state.isDatePickerVisible}
        toggleDatePicker={this.toggleDatePicker}
        handleDatePickerSelection={this.handleDatePickerSelection}
        daysBackAccessible={this.daysBackAccessible}
        startTimelineTS={this.state.startTimelineTS}
        endTimelineTS={this.state.endTimelineTS}
        catalogue={this.state.catalogue}
        viewWindowIncrementSize={this.state.viewWindowIncrementSize}
        handleExportMode={this.handleExportMode}
        exportMode={this.state.exportMode}
        changeExportTSRange={this.changeExportTSRange}
        isFollowing={this.state.isFollowing}
        noLongerFollowing={this.noLongerFollowing}
        loadingArchivalVideo={this.state.loadingArchivalVideo}
        subtractDays={this.state.subtractDays}
        message={this.state.message}
        displayMessage={this.state.displayMessage}
        dataFromTS={dataFromTS}
        daysWithData={this.state.daysWithData}
        stopVideoElem={this.stopVideoElem}
        handleZoom={this.handleZoom}
        isZoomIn={this.state.isZoomIn}
        entitySelectorOptions={this.state.entitySelectorOptions}
        toggleEntitySelectorDisplay={this.toggleEntitySelectorDisplay}
        displayEntitySelector={this.state.displayEntitySelector}
        metadata={this.state.metadata}
        handleEntitySelection={this.handleEntitySelection}
        selectedEntities={this.state.selectedEntities}
        toggleSeekInputDisplay={this.toggleSeekInputDisplay}
        showSeekInputDisplay={this.state.showSeekInputDisplay}
        sendTooltipMessage={this.sendTooltipMessage}
        retention={this.state.retention}
        setInitTS={this.state.setInitTS}
        toggleSetInitTS={this.toggleSetInitTS}
        initTS={this.state.initTS}
        isTSWithinRetentionDays={this.isTSWithinRetentionDays}
        showDispatchMenu={this.state.showDispatchMenu}
        toggleDispatchMenu={this.toggleDispatchMenu}
        createDispatchRequest={this.createDispatchRequest}
        creatingDispatchRequest={this.creatingDispatchRequest}
        entitiesOnly={this.state.entitiesOnly}
        toggleEntitiesOnly={this.toggleEntitiesOnly}
        jumpToInitTS={this.jumpToInitTS}
        tsTimelineHighlight={this.props.tsTimelineHighlight}
      />
    ) : null

    const loaderDisplay = this.state.loading ? (
      <span className='live-stream-loader'>
        <i className='fa fa-spinner fa-spin' />
      </span>
    ) : null
    const playButtonDisplay =
      this.props.editingVideowall === true ? 'none' : previewDisplay

    const { fluid, minStreamHeight, minWidth } = this.props

    // This is necessary for live streaming to work on mobile browsers.
    const Video = (
      <div
        style={{
          width: fluid ? '100%' : 'auto',
          height: fluid ? '100%' : 'auto',
          overflow: fluid ? 'hidden' : 'initial',
        }}
        dangerouslySetInnerHTML={{
          __html: `
        <video
          muted
          playsinline
          class='stream live-stream-placeholder'
          style='width: ${
            minWidth ? `${minWidth}` : '100%'
          }; opacity: 1; height: ${fluid ? '100%' : 'auto'}'
        />
      `,
        }}
        // eslint-disable-next-line no-return-assign
        ref={el => (this.videoContainer = el)}
      />
    )

    return (
      <div style={this.props.containerStyle}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div
            className='play-btn-container'
            style={{
              display: `${previewDisplay}`,
              color: 'red',
              cursor: 'pointer',
            }}
            onClick={this.playElem}
          >
            <span
              style={{
                display: `${playButtonDisplay}`,
                marginLeft: 4,
                marginTop: 3,
                cursor: 'pointer',
              }}
              onClick={this.playElem}
            >
              <Play
                stroke={this.props.theme.palette.common.white}
                fill={this.props.theme.palette.common.white}
                onClick={this.playElem}
                style={{
                  cursor: 'pointer',
                }}
              />
            </span>
          </div>
          <img
            className='preview full live-stream-placeholder'
            alt='Stream Preview'
            src={LoadingBackground}
            style={{
              display: this.state.placeholderLoaded
                ? 'none'
                : `${previewDisplay}`,
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
            }}
          />
          <img
            className='preview full live-stream-placeholder'
            alt='Stream Preview'
            src={this.state.streamPlaceholder}
            style={{
              display: this.state.placeholderLoaded
                ? `${previewDisplay}`
                : 'none',
              width: '100%',
              backgroundColor: 'black',
            }}
            onClick={this.playElem}
            onLoad={() => this.setState({ placeholderLoaded: true })}
          />
        </div>
        <Grid container style={{ display: `${loadingDisplay}` }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <LinearProgress />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              bgcolor='text.primary'
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <img
                className='preview full live-stream-placeholder'
                alt='Stream Preview'
                src={LoadingBackground}
                style={{
                  display: this.state.placeholderLoaded
                    ? 'none'
                    : 'inline-block',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                }}
              />
              <img
                className='preview full live-stream-placeholder'
                alt='Stream Preview'
                src={this.state.streamPlaceholder}
                style={{
                  display: this.state.placeholderLoaded
                    ? 'inline-block'
                    : 'none',
                  width: '100%',
                  backgroundColor: 'black',
                }}
                onLoad={() => this.setState({ placeholderLoaded: true })}
              />
              <CircularProgress
                variant='determinate'
                value={this.state.signalProgress}
                color='primary'
                style={{ position: 'absolute' }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container style={{ display: `${waitingDisplay}` }}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              bgcolor='text.primary'
              style={{ height: minStreamHeight }}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <span style={{ color: this.props.theme.palette.common.white }}>
                Max viewers reached
              </span>
            </Box>
          </Grid>
        </Grid>
        <div
          style={{
            background: 'black',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            height: fluid ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              display: `${streamDisplay}`,
              position: 'relative',
              width: fluid ? '100%' : 'auto',
              height: fluid ? '100%' : 'auto',
            }}
          >
            <span
              className={`indicator ${this.state.indicatorState}`}
              style={{
                display: `${streamDisplay}`,
                position: 'absolute',
                background: this.props.theme.palette.secondary.main,
                color: this.props.theme.palette.common.white,
                right: 0,
                padding: '4px',
                margin: '4px',
                fontSize: '12px',
              }}
            >
              {indicatorStatus}
            </span>
            {loaderDisplay}
            {Video}
          </div>
          {playbackControlsDisplay}
        </div>
      </div>
    )
  }
}

VideoStream.defaultProps = {
  accountSlug: '',
  autoReconnectAttempts: false,
  client: {},
  containerStyle: { position: 'relative', height: '100%' },
  createNotification: () => {},
  debugMode: false,
  editingVideowall: false,
  fluid: false, // this is needed if we want to show video full width & height
  hangup: () => {},
  initTS: null,
  isZoomInInit: 0,
  minStreamHeight: '100%',
  modelHash: null,
  modelId: null,
  modelType: null,
  nodeId: null,
  previewFreq: PreviewFrequency.SLOW,
  reconnectTimeoutMs: false,
  requestCandidates: () => {},
  requestIceServers: () => {},
  sendCandidate: () => {},
  sendExportRequest: () => {},
  sendOffer: () => {},
  sessionId: null,
  showPlaybackControls: false,
  siteSlug: '',
  streamId: null,
  streamName: null,
  streamType: StreamTypeEnum.NORMAL,
  subscribe: () => {},
  tsTimelineHighlight: null,
  unsubscribe: () => {},
  updateArchivalPlayTime: () => {},
  willAutoLoad: false,
}

VideoStream.propTypes = {
  accountSlug: PropTypes.string,
  autoReconnectAttempts: PropTypes.bool,
  client: PropTypes.object,
  containerStyle: PropTypes.object,
  createNotification: PropTypes.func,
  debugMode: PropTypes.bool,
  editingVideowall: PropTypes.bool,
  fluid: PropTypes.bool,
  hangup: PropTypes.func,
  initTS: PropTypes.number,
  isZoomInInit: PropTypes.number,
  minStreamHeight: PropTypes.string,
  minWidth: PropTypes.number,
  modelHash: PropTypes.string,
  modelId: PropTypes.number,
  modelType: PropTypes.string,
  nodeId: PropTypes.string,
  previewFreq: PropTypes.string,
  reconnectTimeoutMs: PropTypes.bool,
  requestCandidates: PropTypes.func,
  requestIceServers: PropTypes.func,
  sendCandidate: PropTypes.func,
  sendExportRequest: PropTypes.func,
  sendOffer: PropTypes.func,
  sessionId: PropTypes.string,
  showPlaybackControls: PropTypes.bool,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  streamName: PropTypes.string,
  streamType: PropTypes.string,
  subscribe: PropTypes.func,
  tsTimelineHighlight: PropTypes.number,
  unsubscribe: PropTypes.func,
  updateArchivalPlayTime: PropTypes.func,
  willAutoLoad: PropTypes.bool,
}

const mapStateToProps = state => ({
  streamType: state.settings.streamType,
})

const mapDispatchToProps = dispatch => ({
  createNotification: message =>
    dispatch(createNotificationAction({ message })),
  subscribe: (key, callback) => dispatch(subscribeAction(key, callback)),
  unsubscribe: key => dispatch(unsubscribeAction(key)),
  requestIceServers: data => dispatch(requestIceServersAction(data)),
  requestCandidates: data => dispatch(requestCandidatesAction(data)),
  sendCandidate: data => dispatch(sendCandidateAction(data)),
  sendOffer: data => dispatch(sendOfferAction(data)),
  sendExportRequest: data => dispatch(sendExportRequestAction(data)),
  updateArchivalPlayTime: data => dispatch(updateArchivalPlayTimeAction(data)),
  hangup: data => dispatch(hangupAction(data)),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withApollo,
  withTheme,
)(VideoStream)
