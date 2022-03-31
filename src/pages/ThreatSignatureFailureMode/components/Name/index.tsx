/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useDispatch } from 'react-redux'

import { setSelectedThreatSignature } from '../../redux/threatSignatureFailureModeSlice'

import { useStyles } from './styles'

interface RowData {
  name: string
  id: number
  validFailureModes: number[]
  selected: boolean
}

const RenderDefaultCell = (rowData: RowData): JSX.Element => {
  const dispatch = useDispatch()
  const classes = useStyles({ selected: rowData.selected })
  return (
    <div
      role='button'
      className={classes.cell}
      tabIndex={-1}
      onClick={() => dispatch(setSelectedThreatSignature(rowData.id))}
      onKeyDown={ev => {
        if (ev.keyCode === 13) {
          dispatch(setSelectedThreatSignature(rowData.id))
        }
      }}
    >
      <span className='am-subtitle1'>{rowData.name}</span>
    </div>
  )
}

export default RenderDefaultCell
