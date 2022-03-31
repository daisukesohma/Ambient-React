import React from 'react'
import moment from 'moment'
// src
import msToUnix from 'utils/msToUnix'

interface Prop {
  alert: {
    tsIdentifier: string | number
  }
}

export default function ActiveAlertInfo({
  alert: { tsIdentifier },
}: Prop): JSX.Element {
  const momentTime = moment.unix(msToUnix(tsIdentifier))
  const time = momentTime.format('ddd MM/DD/YY HH:MM:ssA')
  const timeFromNow = momentTime.fromNow()

  return (
    <>
      <span>{time}</span>
      &nbsp;
      <span>{`(${timeFromNow})`}</span>
    </>
  )
}
