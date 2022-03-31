import React from 'react'
import clsx from 'clsx'
// src
import { getEventByThreatSignaturePause } from 'pages/ActivityLog/utils'

import useStyles from './styles'

interface Props {
  activity: {
    streams: { name: string }[]
    createdBy: {
      user: {
        firstName: string
        lastName: string
      }
    }
    cancelledBy: {
      user: {
        firstName: string
        lastName: string
      }
    }
    threatSignature: {
      name: string
    }
    endTs: number
    description: string
  }
  fontSizeClass?: string
  darkMode?: boolean
}

const defaultProps = {
  fontSizeClass: 'am-subtitle2',
  darkMode: false,
}

function ThreatSignaturePausePeriod({
  activity,
  fontSizeClass,
  darkMode,
}: Props): JSX.Element {
  const classes = useStyles({ darkMode })

  return (
    <div className={clsx(fontSizeClass, classes.grayColor)}>
      <span className={fontSizeClass}>
        {getEventByThreatSignaturePause(activity)}
      </span>
    </div>
  )
}

ThreatSignaturePausePeriod.defaultProps = defaultProps

export default ThreatSignaturePausePeriod
