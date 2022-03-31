import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import toLower from 'lodash/toLower'
import clsx from 'clsx'
import strReplace from 'react-string-replace'
import { useSelector } from 'react-redux'
// src
import ActivePulse from 'components/ActivePulse'
import UserAvatar from 'components/UserAvatar'
import AlertDescriptionColorEnum from 'enums/AlertDescriptionColorEnum'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'
import statuses from './statuses-map'

const propTypes = {
  lastTimelineEvent: PropTypes.object.isRequired,
}

const defaultProps = {
  lastTimelineEvent: {},
}

const AlertEventStatus = ({ lastTimelineEvent }) => {
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })
  const { user, profile, status, __typename } = lastTimelineEvent

  // CLEANUP: This logic is duplicated in AlertCommon/TimelineV4/TimelineItem
  // will want to consolidate to avoid duplicate code / inconsistency later
  const [text, variant] = useMemo(() => {
    if (isEmpty(__typename) || isEmpty(status)) return ['', null]
    let variantColor

    if (__typename === 'AlertEventDispatchType') {
      variantColor = 'yellow' // default
      if (status === 'requested' || status === 'denied') {
        variantColor = 'red'
      }
      if (status === 'resolved') {
        variantColor = 'green'
      }
    }

    if (__typename === 'AlertEventStatusType') {
      variantColor = 'yellow'
      if (status === 'raised') {
        variantColor = 'red'
      } else if (status === 'resolved') {
        variantColor = 'green'
      }
    }

    return [statuses[__typename][toLower(status)], variantColor]
  }, [__typename, status])

  const userData = useMemo(() => {
    if (isEmpty(user) && isEmpty(profile)) return false
    if (isEmpty(user)) return { img: profile.img, ...profile.user }
    return { img: user.profile.img, ...user }
  }, [user, profile])

  if (isEmpty(text)) return false

  const decoratedText = () => {
    return strReplace(text, /%(.*?)%/g, (match, index) => (
      <span
        style={{
          color: AlertDescriptionColorEnum[variant],
          fontStyle: 'bold',
        }}
        key={`${lastTimelineEvent.id}-ticker-template-${index}`}
      >
        {match}
      </span>
    ))
  }

  const userName = `${userData.firstName} ${userData.lastName}`

  return (
    <div
      id='alert-event-status'
      className={classes.root}
      key={`alertEventTicker-${lastTimelineEvent.id}`}
    >
      <span style={{ marginRight: 4 }}>
        <ActivePulse variant={variant} />
      </span>
      {userData && (
        <Tooltip
          content={<TooltipText text={`${userName} (${userData.email})`} />}
        >
          <UserAvatar
            img={userData.img}
            name={userName}
            size={20}
            key={`lastTimelineEventCardAvatar-${lastTimelineEvent.id}`}
          />
        </Tooltip>
      )}
      <div className={clsx('am-caption', classes.tickerText)}>
        {userData && userData.firstName} {decoratedText()}
      </div>
    </div>
  )
}

AlertEventStatus.propTypes = propTypes
AlertEventStatus.defaultProps = defaultProps

export default AlertEventStatus
