/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'

import { RowData } from '../interfaces'

const RenderDefaultCell = (value: string) => (
  rowData: RowData,
): JSX.Element => {
  if (rowData.isExpired) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 'fit-content',
          alignItems: 'center',
          color: '#9FA2A7',
        }}
      >
        <span className='am-subtitle1'>{rowData[value]}</span>
      </div>
    )
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'fit-content',
        alignItems: 'center',
      }}
    >
      <span className='am-subtitle1'>{rowData[value]}</span>
    </div>
  )
}

export default RenderDefaultCell
