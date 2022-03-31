import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import parseInt from 'lodash/parseInt'
import get from 'lodash/get'
// src
import { Icon } from 'ambient_ui'
import {
  dispatchAlertRequested,
  setDispatchAlertCustomTimeMode,
  setModalOpen,
} from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import CircularIconButton from 'components/Buttons/CircularIconButton'

import DispatchMenu from '../DispatchMenu'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  videoStreamKey: PropTypes.string.isRequired,
}

const DispatchAlert = ({ accountSlug, siteSlug, streamId, videoStreamKey }) => {
  const { palette } = useTheme()
  const dispatch = useDispatch()

  // Toggle Open and Open State Start
  const modalOpen = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'modalOpen',
    }),
  )
  const isOpen = get(modalOpen, 'customAlert', false)

  const toggleOpen = open => {
    dispatch(
      setModalOpen({
        videoStreamKey,
        modal: 'customAlert',
        open: open || null, // null will toggle the state in redux slice
      }),
    )
  }
  // Toggle Open and Open State End

  const creatingDispatchRequest = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'creatingDispatchRequest',
    }),
  )

  const createDispatchRequest = (title, ts, callback) => {
    dispatch(
      dispatchAlertRequested({
        videoStreamKey,
        accountSlug,
        siteSlug,
        streamId: parseInt(streamId),
        ts: Math.floor(ts).toString(),
        name: title,
        callback,
      }),
    )
  }

  const toggleDispatchMenu = () => {
    const newState = !isOpen
    if (!newState)
      dispatch(setDispatchAlertCustomTimeMode({ videoStreamKey, value: false }))
    toggleOpen(newState)
  }

  return (
    <>
      <div onClick={toggleDispatchMenu}>
        <CircularIconButton
          borderVisible={isOpen}
          iconNode={<Icon icon='bell' color={palette.primary.main} size={20} />}
          tooltipContent='Custom Alert'
        />
      </div>
      {isOpen && (
        <DispatchMenu
          createDispatchRequest={createDispatchRequest}
          creatingDispatchRequest={creatingDispatchRequest}
          videoStreamKey={videoStreamKey}
          onClose={() => toggleOpen(false)}
        />
      )}
    </>
  )
}

DispatchAlert.propTypes = propTypes

export default memo(DispatchAlert)
