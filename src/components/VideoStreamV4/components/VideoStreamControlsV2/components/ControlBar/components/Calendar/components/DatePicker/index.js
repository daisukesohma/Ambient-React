import React, { useState, memo, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import clsx from 'clsx'
import first from 'lodash/first'
import last from 'lodash/last'
import { useSelector, useDispatch } from 'react-redux'
// src
import { WheelDateTimePicker } from 'ambient_ui'
import {
  useCursorStyles,
  useFlexStyles,
  useFuturisticStyles,
} from 'common/styles/commonStyles'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'

import { catalogueFetchRequested } from '../../vmsCalendarSlice'

import useStyles from './styles'
import trackEventToMixpanel from '../../../../../../../../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../../../../../../../../enums'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  videoStreamKey: PropTypes.string.isRequired,
  gotoPlaybackTime: PropTypes.func,
  setIsCalendarOpen: PropTypes.func,
  streamId: PropTypes.number,
}

function DatePicker({
  accountSlug,
  siteSlug,
  gotoPlaybackTime,
  setIsCalendarOpen,
  videoStreamKey,
  streamId,
}) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const cursorClasses = useCursorStyles()
  const futuristicClasses = useFuturisticStyles()
  const flexClasses = useFlexStyles()
  const [calendarDate, setCalendarDate] = useState(moment())
  const catalogue = useSelector(state => state.vmsCalendar.catalogue)

  // RETENTION DAYS
  //
  const motionSegmentRetentionDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'retention.motionSegmentRetentionDays',
      defaultValue: 0,
    }),
  )

  const nonmotionSegmentRetentionDays = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'retention.nonmotionSegmentRetentionDays',
      defaultValue: 0,
    }),
  )

  const maxRetentionDays = useMemo(
    () => Math.max(motionSegmentRetentionDays, nonmotionSegmentRetentionDays),
    [motionSegmentRetentionDays, nonmotionSegmentRetentionDays],
  )

  const timeRange = useMemo(
    () => [moment().subtract(maxRetentionDays, 'days'), moment()],
    [maxRetentionDays],
  )

  const isValidSelectedDate = calendarDate.toDate() < new Date()

  // requery catalogue every time timeRange changes in redux
  useEffect(() => {
    if (timeRange) {
      dispatch(
        catalogueFetchRequested({
          videoStreamKey,
          accountSlug,
          siteSlug,
          streamId,
          startTs: first(timeRange).unix(),
          endTs: last(timeRange).unix(),
        }),
      )
    }
  }, [timeRange, accountSlug, dispatch, siteSlug, streamId, videoStreamKey])

  return (
    <div className={clsx(cursorClasses.pointer, classes.calendarContainer)}>
      <div
        className={clsx(
          'am-overline',
          flexClasses.row,
          flexClasses.centerAll,
          classes.warningBar,
        )}
      >
        {!isValidSelectedDate && <div>Select a time in the past</div>}
      </div>
      <WheelDateTimePicker
        initialDate={moment()
          .utc()
          .toDate()}
        onChange={date => setCalendarDate(date)}
        minDate={first(timeRange)}
        maxDate={last(timeRange)}
        highlightRanges={catalogue}
      />
      <div
        className={clsx(
          'am-overline',
          flexClasses.row,
          classes.buttonContainer,
        )}
      >
        <div
          className={clsx(
            flexClasses.row,
            flexClasses.centerAll,
            classes.cancelButton,
            futuristicClasses.iceSheet,
          )}
          onClick={() => {
            setIsCalendarOpen(false)
          }}
        >
          Cancel
        </div>
        <div
          className={clsx(
            flexClasses.row,
            flexClasses.centerAll,
            classes.goButton,
            futuristicClasses.iceSheet,
          )}
          onClick={() => {
            if (isValidSelectedDate) {
              trackEventToMixpanel(MixPanelEventEnum.VMS_CALENDAR_CHANGED)
              gotoPlaybackTime(calendarDate.toDate())
              setIsCalendarOpen(false)
            }
          }}
        >
          Go
        </div>
      </div>
    </div>
  )
}

DatePicker.propTypes = propTypes

export default memo(DatePicker)
