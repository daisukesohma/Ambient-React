/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import ActivePulse from 'components/ActivePulse'

import { RowData } from '../interfaces'

import useStyles from './styles'

export default function RenderStatus(rowData: RowData): JSX.Element {
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const currentTime = new Date()

  let timeLeft = null

  if (rowData.isActive) {
    const currentTimeDiff = rowData.tsEndActive
      ? rowData.tsEndActive! - currentTime.getTime() / 1000
      : rowData.tsEndRequested! - currentTime.getTime() / 1000
    const hours = Math.floor(currentTimeDiff / 3600)
    const mins = Math.floor((currentTimeDiff % 3600) / 60)
    timeLeft =
      hours > 0 ? `${hours} hours ${mins} mins left` : `${mins} mins left`
  } else if (rowData.tsStartActive !== null && rowData.tsEndActive !== null) {
    const activeTimeDiff = rowData.tsEndActive! - rowData.tsStartActive!
    const hours = Math.floor(activeTimeDiff / 3600)
    const mins = Math.ceil((activeTimeDiff % 3600) / 60)
    timeLeft =
      hours > 0
        ? `Active for ${hours} hours ${mins} mins`
        : `Active for ${mins} mins`
  }

  return (
    <div>
      <div
        className={clsx({
          [classes.cell]: true,
          [classes.expired]: rowData.isExpired,
        })}
      >
        <span className='am-subtitle1'>{rowData.status}</span>
        {rowData.isActive && (
          <div style={{ paddingLeft: 8 }}>
            <ActivePulse isActive />
          </div>
        )}
      </div>
      {timeLeft && (
        <div className={clsx({ [classes.expired]: rowData.isExpired })}>
          {timeLeft}
        </div>
      )}
    </div>
  )
}
