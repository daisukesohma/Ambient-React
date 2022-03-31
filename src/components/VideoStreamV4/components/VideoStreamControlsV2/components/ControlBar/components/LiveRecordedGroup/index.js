import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import { PlaybackStatusEnum } from '../../../../../../../../enums'
import { setVideoStreamValues } from '../../../../../../../../redux/slices/videoStreamControls'
import getVideoStreamControlsState from '../../../../../../../../selectors/videoStreamControls/getVideoStreamControlsState'
import { useVideoCommands } from '../../../../../../../../common/hooks/video'
import useGotoPlaybackTime from '../../../../../../hooks/useGotoPlaybackTime'

const propTypes = {
  isPlayingLive: PropTypes.bool,
  videoStreamKey: PropTypes.string.isRequired,
  initTs: PropTypes.number,
}

function LiveRecordedGroup({ isPlayingLive, videoStreamKey, initTs }) {
  const dispatch = useDispatch()
  const playTime = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'playTime',
    }),
  )
  const gotoPlaybackTime = useGotoPlaybackTime({ videoStreamKey })
  const { deviceGoLive } = useVideoCommands({ videoStreamKey })

  const handleGoLive = useCallback(() => {
    deviceGoLive() // webrtc command for feed
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          key: new Date().getTime(),
          startAt: new Date(),
          speed: 1,
          playTime: new Date(),
          times: [], // will reset the times array, which keeps track of different times played at different speeds
        },
      }),
    )
  }, [deviceGoLive, dispatch, videoStreamKey])

  // delegate value to isPlayingLive
  const handleModeButton = (event, modeButtonValue) => {
    if (modeButtonValue === PlaybackStatusEnum.LIVE) {
      handleGoLive()
    } else if (modeButtonValue === PlaybackStatusEnum.RECORDED) {
      gotoPlaybackTime(moment(playTime).toDate()) // assumption: don't change date or time
    } else if (modeButtonValue === PlaybackStatusEnum.INCIDENT) {
      gotoPlaybackTime(moment.unix(initTs).toDate())
    }
  }

  const handleReplayIncident = () => {
    if (getModeButtonValue() === PlaybackStatusEnum.INCIDENT) {
      gotoPlaybackTime(moment.unix(initTs).toDate())
    }
  }

  const getModeButtonValue = () => {
    if (isPlayingLive) return PlaybackStatusEnum.LIVE
    if (initTs) return PlaybackStatusEnum.INCIDENT
    return PlaybackStatusEnum.RECORDED
  }

  const switchTooltipText = () => {
    if (!isPlayingLive) return 'Switch to Live'
    if (initTs) return 'Switch to Incident'
    return 'Switch to Recorded'
  }

  return (
    <Tooltip content={<TooltipText>{switchTooltipText()}</TooltipText>}>
      <span>
        <ToggleButtonGroup
          value={getModeButtonValue()}
          exclusive
          size='small'
          onChange={handleModeButton}
          aria-label='text alignment'
        >
          <ToggleButton
            value={PlaybackStatusEnum.LIVE}
            aria-label={PlaybackStatusEnum.LIVE}
          >
            Live
          </ToggleButton>
          <ToggleButton
            value={
              initTs ? PlaybackStatusEnum.INCIDENT : PlaybackStatusEnum.RECORDED
            }
            aria-label={
              initTs ? PlaybackStatusEnum.INCIDENT : PlaybackStatusEnum.RECORDED
            }
          >
            <div onClick={handleReplayIncident}>
              {initTs ? 'Incident' : 'Recorded'}
            </div>
          </ToggleButton>
        </ToggleButtonGroup>
      </span>
    </Tooltip>
  )
}

LiveRecordedGroup.propTypes = propTypes

export default memo(LiveRecordedGroup)
