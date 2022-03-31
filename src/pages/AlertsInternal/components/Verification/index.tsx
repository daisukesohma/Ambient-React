/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

import { useStyles } from './styles'

interface Props {
  verification: string
  socRecall: number | null
}

const capitalize = (s: string) => {
  if (!isEmpty(s)) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }
  return s
}

const Verification = ({ verification, socRecall }: Props): JSX.Element => {
  const classes = useStyles()

  const timeRecalled = socRecall
    ? `Recalled until ${moment(new Date(socRecall * 1000)).format(
        'MMM D, YYYY h:mm:ss a',
      )}`
    : null

  return (
    <div>
      <div className={classes.root}>{capitalize(verification)}</div>
      <div className={classes.time}>{timeRecalled}</div>
    </div>
  )
}

export default Verification
