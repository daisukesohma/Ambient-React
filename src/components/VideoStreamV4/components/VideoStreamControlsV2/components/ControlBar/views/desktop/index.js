import React, { useState, memo } from 'react'
import PropTypes from 'prop-types'
import { Icon as IconKit } from 'react-icons-kit'
import { save } from 'react-icons-kit/feather/save'
import { chartLine } from 'react-icons-kit/typicons/chartLine'
import { search } from 'react-icons-kit/feather/search'
import { warning } from 'react-icons-kit/fa/warning'
import { ic_volume_up } from 'react-icons-kit/md/ic_volume_up'
import { help } from 'react-icons-kit/ionicons/help'
import { share } from 'react-icons-kit/feather/share'
import clsx from 'clsx'
import get from 'lodash/get'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import useMediaQuery from '@material-ui/core/useMediaQuery'
// src
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import { useVideoCommands } from 'common/hooks'
import { useFlexStyles } from 'common/styles/commonStyles'
import {
  setVideoStreamValues,
  resetSearch,
  setModalOpen,
} from 'redux/slices/videoStreamControls'
import { useDispatch, useSelector, batch } from 'react-redux'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import CircularIconButton from 'components/Buttons/CircularIconButton'
import useTriggerResize from 'common/hooks/useTriggerResize'

import { SLIDER_TO_MINUTES } from '../../../../constants'
import Calendar from '../../components/Calendar'
import CurveCustomization from '../../components/CurveCustomization'
import DispatchAlert from '../../components/DispatchAlert'
import KeyboardShortcutHelp from '../../components/KeyboardShortcutHelp'
import KeyShortcutDisplay from '../../components/KeyShortcutDisplay'
import LiveRecordedGroup from '../../components/LiveRecordedGroup'
import PlayControls from '../../components/PlayControls'
import TimeBanner from '../../../TimeBanner'
import TimeDomainDisplay from '../../components/Slider/TimeDomainDisplay'
import TimeDomainSlider from '../../components/Slider/TimeDomainSlider'
import TimeRangeWrapper from '../../components/TimeRangeWrapper'
import VideoShareLink from '../../components/VideoShareLink'

import useStyles from './styles'
import trackEventToMixpanel from 'mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from 'enums'
import SpeakersModal from 'components/molecules/SpeakersModal'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  getMetadata: PropTypes.func,
  handleNextFrame: PropTypes.func,
  handlePreviousFrame: PropTypes.func,
  initTs: PropTypes.number,
  isOnAlertModal: PropTypes.bool,
  isPlaying: PropTypes.bool,
  isPlayingLive: PropTypes.bool,
  playerMoveSeconds: PropTypes.func,
  playerPlayPause: PropTypes.func,
  streamId: PropTypes.number,
  timezone: PropTypes.string,
  videoStreamKey: PropTypes.string,
}

function VideoStreamControlsDesktop({
  accountSlug,
  siteSlug,
  getMetadata,
  handleNextFrame,
  handlePreviousFrame,
  initTs,
  isOnAlertModal,
  isPlaying,
  isPlayingLive,
  playerMoveSeconds,
  playerPlayPause,
  streamId,
  timezone,
  videoStreamKey,
}) {
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
  const triggerResize = useTriggerResize()
  // const [speedLabel, setSpeedLabel] = useState('Normal')
  const modalOpen = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'modalOpen',
    }),
  )
  // const darkMode = useSelector(state => state.settings.darkMode)
  const keyboardShortcutsOpen = get(modalOpen, 'keyboardShortcuts', false)
  const videoShareLinkOpen = get(modalOpen, 'videoShareLink', false)
  const motionOpen = get(modalOpen, 'motion', false)

  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false)

  const { devicePause } = useVideoCommands({ videoStreamKey })

  const classes = useStyles({
    isPlaying,
    isTimeRangeOpen,
  })

  const timeDomainSliderValue = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'timeDomainSliderValue',
    }),
  )

  // for menu play speed
  // const changePlaySpeed = menuItem => {
  //   dispatch(
  //     setVideoStreamValues({
  //       videoStreamKey,
  //       props: { speed: menuItem.value },
  //     }),
  //   )
  //   deviceChangeSpeed(menuItem.value)
  //   setSpeedLabel(menuItem.label)
  // }

  const handleToggleClip = () => {
    if (!isTimeRangeOpen) {
      devicePause()
      setIsTimeRangeOpen(true)
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: { isPlaying: false },
        }),
      )
    } else {
      // deviceUnpause()
      setIsTimeRangeOpen(false)
      // setIsPlaying(true)
    }
  }

  const showForensicsPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showForensicsPanel',
    }),
  )
  const showAlertPanel = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showAlertPanel',
    }),
  )

  const handleToggleForensics = () => {
    const newState = !showForensicsPanel
    if (newState) trackEventToMixpanel(MixPanelEventEnum.VMS_FORENSICS_OPENED)
    batch(() => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            showForensicsPanel: newState,
            showAlertPanel: false,
          },
        }),
      )
      if (!newState) dispatch(resetSearch({ videoStreamKey }))
    })
    triggerResize()
  }

  const handleToggleAlertPanel = () => {
    batch(() => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            showAlertPanel: !showAlertPanel,
            showForensicsPanel: false,
          },
        }),
      )
      dispatch(resetSearch({ videoStreamKey }))
    })
    triggerResize()
  }

  const handleCurveCustomization = () => {
    if (!motionOpen) trackEventToMixpanel(MixPanelEventEnum.VMS_MOTIONS_OPENED)
    dispatch(setModalOpen({ videoStreamKey, modal: 'motion' }))
  }

  const fadeIn = !isPlaying

  return (
    <Grid container justify='center'>
      <Grid
        container
        direction='row'
        justify='flex-start'
        alignItems='flex-start'
        item
        className={classes.leftGroup}
        xs={5}
      >
        <Grid className={classes.liveRecordedGroup} item lg={2} xs={3}>
          <LiveRecordedGroup
            isPlayingLive={isPlayingLive}
            videoStreamKey={videoStreamKey}
            initTs={initTs}
          />
        </Grid>
        {useMediaQuery('(min-width:1500px)') && (
          <Grid className={classes.timerGroup} item lg={4} md={3} sm={3} xs={3}>
            <TimeBanner videoStreamKey={videoStreamKey} timezone={timezone} />
          </Grid>
        )}
        <Grid className={classes.calendarGroup} item>
          <Calendar
            accountSlug={accountSlug}
            siteSlug={siteSlug}
            videoStreamKey={videoStreamKey}
            streamId={streamId}
          />
        </Grid>
        <div
          className={clsx(classes.buttonContainer)}
          onClick={() => {
            if (!keyboardShortcutsOpen)
              trackEventToMixpanel(
                MixPanelEventEnum.VMS_SHORTCUTS_INSTRUCTIONS_OPENED,
              )
            dispatch(
              setModalOpen({ videoStreamKey, modal: 'keyboardShortcuts' }),
            )
          }}
        >
          <CircularIconButton
            borderVisible={keyboardShortcutsOpen}
            iconNode={<IconKit icon={help} size={18} />}
            tooltipContent='Keyboard Shortcuts'
          />
        </div>
        <div
          className={clsx(classes.buttonContainer)}
          onClick={() => {
            trackEventToMixpanel(MixPanelEventEnum.VMS_SHARING_OPENED)
            dispatch(setModalOpen({ videoStreamKey, modal: 'videoShareLink' }))
          }}
        >
          <CircularIconButton
            borderVisible={videoShareLinkOpen}
            iconNode={<IconKit icon={share} size={18} />}
            tooltipContent='Share Video'
          />
        </div>
      </Grid>

      <Grid
        container
        item
        direction='row'
        justify='center'
        alignItems='center'
        sm={2}
      >
        <PlayControls
          accountSlug={accountSlug}
          isPlaying={isPlaying}
          playerMoveSeconds={playerMoveSeconds}
          playerPlayPause={playerPlayPause}
          handlePreviousFrame={handlePreviousFrame}
          handleNextFrame={handleNextFrame}
          videoStreamKey={videoStreamKey}
        />
      </Grid>

      <Hidden mdDown>
        <Grid
          container
          item
          direction='row'
          justify='flex-end'
          alignItems='center'
          md={2}
        >
          <Grid
            className={classes.sliderGroup}
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Tooltip
              content={
                <>
                  <div className={flexClasses.row}>
                    <TooltipText>Timeline Range</TooltipText>
                    <KeyShortcutDisplay keyName='3' />
                    <span style={{ marginLeft: 4 }}>-</span>
                    <KeyShortcutDisplay keyName='9' />
                  </div>
                  <div className={clsx('am-caption', classes.current)}>
                    Current:{' '}
                    {get(SLIDER_TO_MINUTES[timeDomainSliderValue], 'readable')}
                  </div>
                </>
              }
            >
              <div className={clsx(flexClasses.row, flexClasses.centerAll)}>
                <TimeDomainSlider videoStreamKey={videoStreamKey} />
                <TimeDomainDisplay videoStreamKey={videoStreamKey} />
              </div>
            </Tooltip>
          </Grid>
        </Grid>
      </Hidden>

      <Grid
        container
        item
        direction='row'
        justify='flex-end'
        alignItems='center'
        xl={3}
        lg={3}
        md={5}
        sm={5}
      >
        {/* { */}
        {/*   !isPlayingLive && ( */}
        {/*     <div id='playSpeedMenu' style={{ marginRight: 16 }}> */}
        {/*       <OptionMenu */}
        {/*         customIconContainer={false} */}
        {/*         darkMode={darkMode} */}
        {/*         icon={ */}
        {/*           <Tooltip content={<TooltipText>Playback speed</TooltipText>}> */}
        {/*             <div className='am-caption'>{speedLabel}</div> */}
        {/*           </Tooltip> */}
        {/*         } */}
        {/*         menuItems={PLAY_SPEED_MENU_ITEMS.map(i => ({ */}
        {/*           ...i, */}
        {/*           onClick: () => changePlaySpeed(i), */}
        {/*         }))} */}
        {/*         noBackground */}
        {/*         paperClass={undefined} */}
        {/*         textClass='am-caption' */}
        {/*       /> */}
        {/*     </div> */}
        {/*   ) */}
        {/* } */}
        {isTimeRangeOpen && (
          <div id='timeRangeWrapper' className={classes.timeRangeWrapper}>
            <TimeRangeWrapper
              videoStreamKey={videoStreamKey}
              handleClose={() => setIsTimeRangeOpen(false)}
            />
          </div>
        )}

        <div
          className={clsx(
            classes.invisible,
            { fadeIn },
            classes.buttonContainer,
          )}
          style={{ opacity: isPlaying ? 0 : 1 }}
          onClick={() => {
            // This handles the case where alert modal side nav is open. When this happens,
            // the way that the % of the Track components work, it renders the clip handles in the wrong place.
            // As a working fix, this will first close the alert panel, and then use the existing render logic
            // This works, rather than create a custom fix for handling the size of the alert side nav and accounting for it
            if (isOnAlertModal && showAlertPanel) {
              handleToggleAlertPanel()
              setTimeout(() => {
                handleToggleClip()
              }, 1000)
            } else {
              handleToggleClip()
            }
          }}
        >
          <CircularIconButton
            borderVisible={isTimeRangeOpen}
            tooltipDisabled={isPlaying}
            iconNode={<IconKit icon={save} size={20} />}
            tooltipContent='Save Clip'
          />
        </div>
        {isOnAlertModal && (
          <div
            className={classes.buttonContainer}
            onClick={handleToggleAlertPanel}
          >
            <CircularIconButton
              borderVisible={showAlertPanel}
              iconNode={<IconKit icon={warning} size={18} />}
              tooltipContent='Toggle Alert Panel'
              iconButtonStyle={{ padding: '2px 4px 6px 4px' }}
            />
          </div>
        )}
        <span className={classes.buttonContainer}>
          <DispatchAlert
            accountSlug={accountSlug}
            siteSlug={siteSlug}
            videoStreamKey={videoStreamKey}
            streamId={streamId}
          />
        </span>

        <div
          className={classes.buttonContainer}
          onClick={handleCurveCustomization}
        >
          <CircularIconButton
            borderVisible={motionOpen}
            iconNode={<IconKit icon={chartLine} size={20} />}
            tooltipContent='Motion'
          />
        </div>
        <SpeakersModal
          streamId={streamId}
          control={openSpeakersModal => {
            return (
              <div
                className={classes.buttonContainer}
                onClick={openSpeakersModal}
              >
                <CircularIconButton
                  iconNode={<IconKit icon={ic_volume_up} size={20} />}
                  tooltipContent='Speakers'
                />
              </div>
            )
          }}
        />
        <div
          className={clsx(classes.buttonContainer, classes.rightMargin)}
          onClick={handleToggleForensics}
        >
          <CircularIconButton
            borderVisible={showForensicsPanel}
            iconNode={<IconKit icon={search} size={20} />}
            tooltipContent='Investigate Forensics'
          />
        </div>
      </Grid>

      <CurveCustomization
        isOpen={motionOpen}
        getMetadata={getMetadata}
        videoStreamKey={videoStreamKey}
      />
      <KeyboardShortcutHelp isOpen={keyboardShortcutsOpen} />
      <VideoShareLink isOpen={videoShareLinkOpen} />
    </Grid>
  )
}

VideoStreamControlsDesktop.propTypes = propTypes

export default memo(VideoStreamControlsDesktop)
