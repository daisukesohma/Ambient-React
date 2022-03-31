import React, { useCallback } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-icons-kit'
import { close } from 'react-icons-kit/fa/close'
import { bell } from 'react-icons-kit/fa/bell'
// src
import {
  dispatchAlertRequested,
  setVideoStreamValues,
} from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import DispatchMenu from '../DispatchMenu'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  siteSlug: PropTypes.string,
  videoStreamKey: PropTypes.string.isRequired,
  streamId: PropTypes.string,
}

const defaultProps = {
  siteSlug: '',
  streamId: '',
}

const DispatchAlert = ({ accountSlug, videoStreamKey, siteSlug, streamId }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()

  const showDispatchMenu = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'showDispatchMenu',
    }),
  )

  const creatingDispatchRequest = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'creatingDispatchRequest',
    }),
  )

  const videoStreamTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'videoStreamTS' }),
  )

  const createDispatchRequest = useCallback(
    (title, ts) => {
      dispatch(
        dispatchAlertRequested({
          accountSlug,
          siteSlug,
          streamId: Number(streamId),
          ts: Math.floor(ts).toString(),
          name: title,
        }),
      )
    },
    [accountSlug, dispatch, siteSlug, streamId],
  )

  const toggleDispatchMenu = useCallback(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          showDispatchMenu: !showDispatchMenu,
          isDatePickerVisible: false,
        },
      }),
    )
  }, [dispatch, showDispatchMenu, videoStreamKey])

  return (
    <>
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
      {showDispatchMenu && (
        <DispatchMenu
          createDispatchRequest={createDispatchRequest}
          creatingDispatchRequest={creatingDispatchRequest}
          videoStreamTS={videoStreamTS}
        />
      )}
    </>
  )
}

DispatchAlert.propTypes = propTypes
DispatchAlert.defaultProps = defaultProps

export default DispatchAlert
