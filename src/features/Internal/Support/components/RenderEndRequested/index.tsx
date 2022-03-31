/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'

import { RowData } from '../interfaces'

import useStyles from './styles'

export default function RenderEndRequested(rowData: RowData): JSX.Element {
  const darkMode = useSelector((state: any) => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  return (
    <div
      className={clsx({
        [classes.cell]: true,
        [classes.expired]: rowData.isExpired,
      })}
    >
      <span className='am-subtitle1'>
        {formatUnixTimeWithTZ(rowData.tsEndRequested, 'yyy-MM-dd HH:mm:ss zzz')}
      </span>
    </div>
  )
}
