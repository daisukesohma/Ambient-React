/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import ThreatCard from 'pages/ContextGraph/components/ThreatCard'

import { useStyles } from './styles'

interface IObjectKeys {
  [key: string]: string | number | any
}

interface RowData extends IObjectKeys {
  id: number
  name: string
}

const RenderDefaultCell = (rowData: RowData): JSX.Element => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ThreatCard
        tsAlert={rowData}
        tsName={rowData.name}
        disableBottomBorder
        disableAlertIdStatus
      />
    </div>
  )
}

export default RenderDefaultCell
