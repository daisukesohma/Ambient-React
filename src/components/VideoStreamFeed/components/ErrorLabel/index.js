import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
// src
import { useFlexStyles } from 'common/styles/commonStyles'
import getStreamFeedData from 'selectors/webrtc/getStreamFeedData'
import { StreamStateEnum } from 'enums'

import useStyles from './styles'

const propTypes = {
  videoStreamKey: PropTypes.string,
}

function ErrorLabel({ videoStreamKey }) {
  const classes = useStyles()
  const flexClasses = useFlexStyles()
  const webrtcError = useSelector(state => state.webrtc.inError)
  const maxClientError =
    useSelector(getStreamFeedData({ videoStreamKey, property: 'status' })) ===
    StreamStateEnum.MAX_CLIENTS

  if (!webrtcError && !maxClientError) return null

  const getLabel = () => {
    if (webrtcError)
      return 'Connection lost. Please refresh browser to reconnect.'
    if (maxClientError) return 'Max viewers reached'
    return null
  }

  return (
    <div className={classes.root}>
      <div
        className={clsx(
          flexClasses.row,
          flexClasses.centerAll,
          classes.labelContainer,
        )}
      >
        <span className={clsx('am-overline', classes.label)}>{getLabel()}</span>
      </div>
    </div>
  )
}

ErrorLabel.propTypes = propTypes
export default ErrorLabel
