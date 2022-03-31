import React from 'react'
import Tooltip from 'components/Tooltip'

import { useStyles } from './styles'

interface Props {
  dismissedRatio: number
  numPositive: number
  numNegative: number
}

const Performance = ({
  dismissedRatio,
  numPositive,
  numNegative,
}: Props): JSX.Element => {
  const classes = useStyles()

  const calculateDismissed = (): string => {
    // toPrecision would make 1 or -1 show up as 1.0e+2 or -1.0e+2
    if (dismissedRatio === 1 || dismissedRatio === -1) {
      return `${dismissedRatio * 100}%`
    }
    return `${(dismissedRatio * 100).toPrecision(2)}%`
  }
  const calculateFraction = (): string => {
    return `(${numNegative}/${numPositive + numNegative})`
  }

  return (
    <div className={classes.root}>
      <Tooltip content='Dismissed Ratio (Negative / Total)'>
        {`${calculateDismissed()} ${calculateFraction()}`}
      </Tooltip>
    </div>
  )
}

export default Performance
