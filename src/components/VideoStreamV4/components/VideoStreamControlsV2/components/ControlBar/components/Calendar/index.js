import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { calendar } from 'react-icons-kit/feather/calendar'
import { Icon as IconKit } from 'react-icons-kit'
import get from 'lodash/get'
// src
import CircularIconButton from 'components/Buttons/CircularIconButton'
import getVideoStreamControlsState from 'selectors/videoStreamControls/getVideoStreamControlsState'
import { setModalOpen } from 'redux/slices/videoStreamControls'

import useGotoPlaybackTime from '../../../../../../hooks/useGotoPlaybackTime'

import DatePicker from './components/DatePicker'
import trackEventToMixpanel from '../../../../../../../../mixpanel/utils/trackEventToMixpanel'
import { MixPanelEventEnum } from '../../../../../../../../enums'

const propTypes = {
  accountSlug: PropTypes.string,
  siteSlug: PropTypes.string,
  streamId: PropTypes.number,
  videoStreamKey: PropTypes.string,
}

function Calendar({ accountSlug, siteSlug, streamId, videoStreamKey }) {
  const dispatch = useDispatch()
  const gotoPlaybackTime = useGotoPlaybackTime({ videoStreamKey })
  const modalOpen = useSelector(
    getVideoStreamControlsState({
      videoStreamKey,
      property: 'modalOpen',
    }),
  )
  const calendarOpen = get(modalOpen, 'calendar', false)

  const toggleCalendarOpen = () => {
    dispatch(setModalOpen({ videoStreamKey, modal: 'calendar' }))
  }

  return (
    <>
      <div onClick={toggleCalendarOpen}>
        <CircularIconButton
          borderVisible={calendarOpen}
          iconNode={<IconKit icon={calendar} size={18} />}
          tooltipContent='Calendar'
          iconButtonStyle={{ padding: '2px 4px 6px 4px' }}
        />
      </div>
      {calendarOpen && (
        <DatePicker
          accountSlug={accountSlug}
          siteSlug={siteSlug}
          gotoPlaybackTime={gotoPlaybackTime}
          setIsCalendarOpen={toggleCalendarOpen}
          videoStreamKey={videoStreamKey}
          streamId={streamId}
        />
      )}
    </>
  )
}

Calendar.propTypes = propTypes
export default Calendar
