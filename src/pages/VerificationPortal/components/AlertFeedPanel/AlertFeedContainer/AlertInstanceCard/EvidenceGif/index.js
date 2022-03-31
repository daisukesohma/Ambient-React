/*
  Gets the EvidenceGif for an alertInstance. It polls for the EvidenceGif but uses jitter and exponential backoff to reduce Server load.
  Mandatory props:
    - alertInstance --> AlertInstance object
  Optional props:
    - maxTries --> Integer - number of times to attempt to get EvidenceGif (default is 20)

  author: Rodaan Peralta-Rabang rodaan@ambient.ai / Alex Leontev aleks@ambient.ai
*/
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Skeleton from '@material-ui/lab/Skeleton'
import isEmpty from 'lodash/isEmpty'
// src
import { alertClipFetchRequested } from 'pages/VerificationPortal/redux/verificationSlice'
import useInterval from 'common/hooks/useInterval'

import './index.css'

const propTypes = {
  alertInstance: PropTypes.object,
  maxTries: PropTypes.number,
  interval: PropTypes.number,
}

const defaultProps = {
  alertInstance: {},
  maxTries: 20,
  interval: 500,
}

function EvidenceGif({ alertInstance, maxTries, interval }) {
  const dispatch = useDispatch()
  const [tries, setTries] = useState(0)
  const clipSpe = useSelector(state => state.verification.clipSpe)

  const clipProp = clipSpe ? alertInstance.clipSpe : alertInstance.clip

  useInterval(() => {
    if (tries >= maxTries || !isEmpty(clipProp) || alertInstance.clipLoading)
      return
    dispatch(
      alertClipFetchRequested({
        alertInstanceId: alertInstance.id,
        alertInstanceHash: alertInstance.alertHash,
      }),
    )
    setTries(tries + 1)
  }, interval)

  if (isEmpty(clipProp))
    return <Skeleton animation='wave' variant='rect' width='100%' />

  return (
    <img
      src={clipProp}
      style={{
        width: '100%',
        height: 'auto',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      }}
      alt='Missing Clip'
      onError={() => 'static/img/preloader.gif'}
    />
  )
}

EvidenceGif.propTypes = propTypes
EvidenceGif.defaultProps = defaultProps

export default EvidenceGif
