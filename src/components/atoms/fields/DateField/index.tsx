import React from 'react'
import clsx from 'clsx'
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'

import useStyles from './styles'

interface Props {
  timestamp: number
}

export default function DateField({ timestamp }: Props): JSX.Element {
  const { baseText } = useStyles()

  return (
    <div className={clsx('am-subtitle2', baseText)}>
      {formatUnixTimeWithTZ(timestamp, 'yyyy-MM-dd HH:mm:ss zzz')}
    </div>
  )
}
