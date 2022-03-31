import React, { useState } from 'react'
import SignalWifi0Bar from '@material-ui/icons/SignalWifi0Bar'
import SignalWifi1BarIcon from '@material-ui/icons/SignalWifi1Bar'
import SignalWifi2BarIcon from '@material-ui/icons/SignalWifi2Bar'
import SignalWifi3BarIcon from '@material-ui/icons/SignalWifi3Bar'
import SignalWifi4BarIcon from '@material-ui/icons/SignalWifi4Bar'
// src
import useBandWidth from 'common/hooks/useBandWidth'

const BAND_WIDTH_INTERVAL = 15 * 1000

export default function InternetSpeedIndicator(): JSX.Element {
  const [speed, setSpeed] = useState(200)

  useBandWidth(setSpeed, BAND_WIDTH_INTERVAL)

  const determineLevelIcon = () => {
    if (speed === 0)
      return <SignalWifi0Bar htmlColor='rgb(255, 194, 205)' fontSize='small' />
    if (speed < 50)
      return (
        <SignalWifi1BarIcon htmlColor='rgb(255, 194, 205)' fontSize='small' />
      )
    if (speed >= 50 && speed < 150)
      return <SignalWifi2BarIcon color='secondary' fontSize='small' />
    if (speed >= 150 && speed < 250)
      return <SignalWifi3BarIcon color='secondary' fontSize='small' />
    if (speed >= 250)
      return (
        <SignalWifi4BarIcon fontSize='small' htmlColor='rgb(24, 255, 166)' />
      )
    return <SignalWifi1BarIcon color='error' fontSize='small' />
  }

  return determineLevelIcon()
}
