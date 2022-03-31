import React from 'react'
import get from 'lodash/get'
import Chip from '@material-ui/core/Chip'

import useStyles from './styles'

const CheckinStatus = rowData => {
  const classes = useStyles()
  const role = get(rowData, 'role')
  const startWorkShift = get(rowData, 'lastWorkShiftPeriod.startWorkShift')
  const endWorkShift = get(rowData, 'lastWorkShiftPeriod.endWorkShift')
  const siteName = get(rowData, 'lastWorkShiftPeriod.site.name')
  if (role !== 'Responder') {
    return 'N/A'
  }

  if (!startWorkShift || endWorkShift) {
    return (
      <Chip
        label='Checked Out'
        classes={{ label: classes.label, root: classes.root }}
      />
    )
  }

  return (
    <Chip
      label={`Checked In: ${siteName}`}
      classes={{ label: classes.activeLabel, root: classes.activeRoot }}
    />
  )
}

export default CheckinStatus
