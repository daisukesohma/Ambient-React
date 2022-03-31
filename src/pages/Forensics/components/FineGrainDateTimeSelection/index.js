import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import clsx from 'clsx'

import { useFlexStyles } from 'common/styles/commonStyles'
import selectionRangeSelector from 'selectors/forensics/selectionRange'
import isSelectionFilteredSelector from 'selectors/forensics/isSelectionFiltered'

import TimeRangeSlider from './components/TimeRangeSlider'
import useStyles from './styles'

export default function FineGrainDateTimeSelection() {
  const flexClasses = useFlexStyles()
  const selectionRange = useSelector(selectionRangeSelector)
  const isSelectionFiltered = useSelector(isSelectionFilteredSelector)
  const classes = useStyles({ isSelectionFiltered })

  const formatTime = unixTs => {
    return moment.unix(unixTs).format('MMM D h:mm A')
  }

  return (
    <div
      className={clsx(
        flexClasses.row,
        flexClasses.centerAll,
        classes.zIndexCorrection,
      )}
      style={{
        zIndex: 100,
        height: 158,
        justifyContent: 'space-around',
        marginLeft: '24px',
      }}
    >
      <div
        className={clsx(
          'am-overline',
          classes.timeLabel,
          classes.zIndexCorrection,
        )}
        style={{ marginRight: -56 }}
      >
        <div>{formatTime(selectionRange[0])}</div>
      </div>
      <div
        style={{ marginTop: -24 }}
        className={clsx(classes.zIndexCorrection, classes.timelineBar)}
      >
        <TimeRangeSlider />
      </div>
      <div
        className={clsx(
          'am-overline',
          classes.timeLabel,
          classes.zIndexCorrection,
        )}
        style={{ marginLeft: 24 }}
      >
        <div>{formatTime(selectionRange[1])}</div>
      </div>
    </div>
  )
}
