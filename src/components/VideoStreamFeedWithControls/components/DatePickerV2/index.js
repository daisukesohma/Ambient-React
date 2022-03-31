import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { DayPickerSingleDateController } from 'react-dates'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import moment from 'moment-timezone'
import { useSelector, useDispatch, batch } from 'react-redux'
// src
import {
  fetchStreamCatalogueDataRequested,
  setVideoStreamValues,
} from 'redux/slices/videoStreamControls'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { getCurrUnixTimestamp } from 'utils'

import tsAtMidnight from '../../utils/tsAtMidnight'
import InfoPanel from '../InfoPanel/InfoPanel'
import { MINUTES_IN_DAY, SECONDS_IN_DAY } from '../../constants'

import { isInclusivelyBeforeDay, isWithinDayBackList } from './utils'
import useStyles from './styles'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  videoStreamKey: PropTypes.string,
  streamId: PropTypes.number,
}

function DatePickerV2({ accountSlug, videoStreamKey, siteSlug, streamId }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const videoStreamTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'videoStreamTS' }),
  )
  const availableDays = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'availableDays' }),
  )
  const dateTS = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'dateTS' }),
  )
  const isZoomIn = useSelector(
    getVideoStreamControlsState({ videoStreamKey, property: 'isZoomIn' }),
  )

  const motionSegmentRetentionDays = get(
    useSelector(
      getVideoStreamControlsState({ videoStreamKey, property: 'retention' }),
    ),
    'motionSegmentRetentionDays',
    0,
  )

  const nonmotionSegmentRetentionDays = get(
    useSelector(
      getVideoStreamControlsState({ videoStreamKey, property: 'retention' }),
    ),
    'nonmotionSegmentRetentionDays',
    0,
  )

  const maxRetentionDays = Math.max(
    motionSegmentRetentionDays,
    nonmotionSegmentRetentionDays,
  )

  const [state, setState] = useState({
    date: moment.unix(dateTS || videoStreamTS),
  })

  // useEffect(() => {
  //   if (videoStreamTS) {
  //     setState(s => ({ ...s, date: moment.unix(videoStreamTS) }))
  //   }
  // }, [videoStreamTS])

  const onDateChange = useCallback(newDate => {
    const newDateTS = newDate.unix()
    const todayTS = tsAtMidnight()
    const diffInTS = todayTS - newDateTS
    let diffInDays = Math.floor(diffInTS / 86400)
    const remainder = diffInTS % 86400

    if (remainder > 0) diffInDays += 1
    if (diffInDays < 0) diffInDays = 0

    setState({
      date: newDate,
      selectedDateDiff: diffInDays,
      selectedDate: newDateTS,
    })
  }, [])

  const onConfirmChange = useCallback(() => {
    const startTs = state.date.startOf('day').unix()
    const endTs = state.date.endOf('day').unix()

    const timelineWidth = isZoomIn === 1 ? SECONDS_IN_DAY : MINUTES_IN_DAY
    const isCurrentDate = state.selectedDateDiff === 0

    const newVideoStreamTS = isCurrentDate ? getCurrUnixTimestamp() : startTs

    batch(() => {
      dispatch(
        setVideoStreamValues({
          videoStreamKey,
          props: {
            isDatePickerVisible: false,
            timelineWidth: isCurrentDate
              ? newVideoStreamTS - tsAtMidnight()
              : timelineWidth,
            dateTS: state.selectedDate,
            startTimelineTS: startTs,
            endTimelineTS: endTs,
            subtractDays: state.selectedDateDiff,
            videoStreamTS: newVideoStreamTS,
            playPointerPosition: isCurrentDate
              ? newVideoStreamTS - tsAtMidnight()
              : 0,
          },
        }),
      )
      dispatch(
        fetchStreamCatalogueDataRequested({
          videoStreamKey,
          accountSlug,
          siteSlug,
          streamId,
          startTs,
          endTs,
          isInitial: false,
        }),
      )
    })
  }, [
    dispatch,
    videoStreamKey,
    state,
    accountSlug,
    siteSlug,
    streamId,
    isZoomIn,
  ])

  const onCancel = useCallback(() => {
    dispatch(
      setVideoStreamValues({
        videoStreamKey,
        props: {
          isDatePickerVisible: false,
          dateTS: dateTS || videoStreamTS,
        },
      }),
    )
  }, [dispatch, videoStreamKey, videoStreamTS, dateTS])

  return (
    <div className={classes.root}>
      <DayPickerSingleDateController
        focused
        date={state.date}
        onDateChange={onDateChange}
        isOutsideRange={day =>
          !isInclusivelyBeforeDay(day, moment()) ||
          isInclusivelyBeforeDay(
            day,
            moment().subtract(maxRetentionDays, 'days'),
          )
        }
        isDayBlocked={day => !isWithinDayBackList(day, availableDays)}
        hideKeyboardShortcutsPanel
        renderCalendarInfo={() => (
          <InfoPanel onCancel={onCancel} onConfirmChange={onConfirmChange} />
        )}
      />
    </div>
  )
}

DatePickerV2.propTypes = propTypes

export default DatePickerV2
