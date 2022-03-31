import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-icons-kit'
import { close } from 'react-icons-kit/fa/close'
import { bell } from 'react-icons-kit/fa/bell'
import {
  dispatchAlertRequested,
  setVideoStreamValues,
} from 'redux/slices/videoStreamControls'
import clsx from 'clsx'

import DispatchMenu from '../DispatchMenu'
import getVideoStreamControlsState from '../../../../selectors/videoStreamControls/getVideoStreamControlsState'

import useStyles from './styles'

const propTypes = {
  accountSlug: PropTypes.string.isRequired,
  siteSlug: PropTypes.string,
  streamId: PropTypes.string,
  videoStreamKey: PropTypes.string.isRequired,
}

const defaultProps = {
  siteSlug: '',
  streamId: '',
}

const DispatchAlert = ({ accountSlug, videoStreamKey, siteSlug, streamId }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

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
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'videoStreamTS',
    }),
  )

  const createDispatchRequest = (title, ts) => {
    dispatch(
      dispatchAlertRequested({
        accountSlug,
        siteSlug,
        streamId: Number(streamId),
        ts: Math.floor(ts).toString(),
        name: title,
      }),
    )
  }

  const toggleDispatchMenu = () => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          showDispatchMenu: !showDispatchMenu,
          isDatePickerVisible: false,
        },
      }),
    )
  }

  return (
    <>
      <button
        id='live'
        // className='playback-button'
        className={clsx('playback-button', classes.button)}
        type='button'
        onClick={toggleDispatchMenu}
      >
        <span className={classes.icon}>
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
