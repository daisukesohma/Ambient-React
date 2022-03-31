/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import ActivePulse from 'components/ActivePulse'

import { useStyles } from './styles'

interface Props {
  status: string
}

const capitalize = (s: string) => {
  if (!isEmpty(s)) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }
  return s
}

const Status = ({ status }: Props): JSX.Element => {
  const classes = useStyles()

  const display = () => {
    if (status === 'active') {
      return <ActivePulse isActive />
    }
    if (status === 'test') {
      return <ActivePulse variant='yellow' />
    }
    return <ActivePulse variant='null' />
  }

  return (
    <div className={classes.root}>
      <div className={classes.pulse}>{display()}</div>
      {capitalize(status)}
    </div>
  )
}

export default Status
