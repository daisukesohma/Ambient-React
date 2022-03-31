import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import clsx from 'clsx'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import toLower from 'lodash/toLower'
import includes from 'lodash/includes'
import strReplace from 'react-string-replace'
// src
import MoreOptionMenu from 'ambient_ui/components/optionMenu/MoreOptionMenu'
import {
  DEFAULT_TIMEZONE,
  formatUnixTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import isThisYear from 'date-fns/isThisYear'
import { getElapsedTime } from 'utils'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'
import AlertDescriptionColorEnum from 'enums/AlertDescriptionColorEnum'
import { useCursorStyles, useFlexStyles } from 'common/styles/commonStyles'
import statuses from 'components/AlertEventCard/components/AlertEventTicker/statuses-map'
import UserAvatar from 'components/UserAvatar'

import useStyles from './styles'

const propTypes = {
  timeline: PropTypes.object,
  color: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  timezone: PropTypes.string,
  initTs: PropTypes.number,
  isFirstItem: PropTypes.bool,
}

const defaultProps = {
  color: '#626469',
  onDelete: () => {},
  timezone: DEFAULT_TIMEZONE,
}

function TimelineItem({
  timeline,
  color,
  onDelete,
  onUpdate,
  timezone,
  initTs,
  isFirstItem,
}) {
  const flexClasses = useFlexStyles()
  const cursorClasses = useCursorStyles()
  const [editComment, setEditComment] = useState('')
  const [editMode, setEditMode] = useState(false)
  const updateCommentLoading = useSelector(
    state => state.alertModal.updateCommentLoading,
  )
  const authUser = useSelector(state => state.auth.user)
  const {
    id,
    user,
    contact,
    profile,
    author,
    __typename,
    ts,
    comment,
    edited,
    createdBy,
  } = timeline

  // NOTE: BE doesn't support detect status for first item...
  const status = isFirstItem ? 'detected' : timeline.status

  const [text, variant] = useMemo(() => {
    // CLEANUP: This logic is duplicated in AlertEventCard/components/AlertEventTicker
    // will want to consolidate to avoid duplicate code / inconsistency later
    //
    // statuses from 'statuses-map'
    //
    if (isEmpty(__typename) || isEmpty(status)) return ['', null]
    let variantColor

    if (__typename === 'AlertEventDispatchType') {
      variantColor = 'yellow' // default
      if (includes(['requested', 'denied'], status)) {
        variantColor = 'red'
      }
      if (status === 'resolved') {
        variantColor = 'green'
      }
    }

    if (__typename === 'AlertEventStatusType') {
      variantColor = 'yellow'
      if (includes(['raised', 'detected'], status)) {
        variantColor = 'red'
      } else if (status === 'resolved') {
        variantColor = 'green'
      }
    }

    const outputStatus = [statuses[__typename][toLower(status)], variantColor]

    // if created by alert
    if (
      __typename === 'AlertEventDispatchType' &&
      status === 'requested' &&
      createdBy
    ) {
      variantColor = 'yellow'

      return [
        `${outputStatus[0]} by ${get(createdBy, 'firstName')} ${get(
          createdBy,
          'lastName',
        )}`,
        variantColor,
      ]
    }

    return outputStatus
  }, [__typename, status, createdBy])

  // NOTE: This dirty code was provoked by BE response. We have 3 different keys for user: user, profile, author.
  const userData = useMemo(() => {
    if (isEmpty(user) && isEmpty(profile) && isEmpty(author)) return false
    if (!isEmpty(author)) return { img: author.img, ...author.user }
    if (!isEmpty(profile)) return { img: profile.img, ...profile.user }
    return { img: user.profile.img, ...user }
  }, [user, profile, author])

  const contactData = useMemo(() => {
    if (isEmpty(contact)) return false
    return {
      img: contact.profile.img,
      ...contact.profile.user,
      method: contact.method,
    }
  }, [contact])

  const isComment = useMemo(() => __typename === 'CommentType', [__typename])
  const classes = useStyles({ color, isComment })

  const decoratedText = useMemo(() => {
    if (updateCommentLoading && isComment) return 'Updating...'
    if (isComment) return comment

    return strReplace(text, /%(.*?)%/g, (match, index) => (
      <span
        style={{
          color: AlertDescriptionColorEnum[variant],
          fontStyle: 'bold',
        }}
        key={`${timeline.id}-timeline-item-template-${index}`}
      >
        {match}
      </span>
    ))
  }, [isComment, comment, text, variant, timeline.id, updateCommentLoading])

  const userName = isEmpty(userData)
    ? ''
    : `${userData.firstName} ${userData.lastName}`

  const contactName = isEmpty(contactData)
    ? ''
    : `${contactData.firstName} ${contactData.lastName}`

  const contactInfo = isEmpty(contactData) ? (
    ''
  ) : (
    <span>
      <div
        className={clsx(
          classes.timelineContact,
          flexClasses.row,
          flexClasses.centerStart,
        )}
      >
        <div className={clsx('am-caption', classes.timelineContactMethod)}>
          {`by ${contactData.method.toLowerCase()} to `}
        </div>
        <UserAvatar
          img={contactData.img}
          name={contactName}
          size={16}
          key={`contactAvatar-${timeline.id}`}
        />
        <div className={clsx('am-caption', classes.timelineContactName)}>
          {contactName}
        </div>
      </div>
    </span>
  )

  const onEdit = () => {
    setEditComment(!editMode ? comment : '')
    setEditMode(!editMode)
  }

  if (isEmpty(decoratedText)) return false

  const shortTimeFormat = 'hh:mm:ss zzz, MMM d'
  const yearFormat = 'y'
  const tsToFormat = status === 'detected' ? initTs : ts

  const shortTimeDisplay = formatUnixTimeWithTZ(
    tsToFormat,
    shortTimeFormat,
    timezone,
  )
  const yearDisplay = formatUnixTimeWithTZ(tsToFormat, yearFormat, timezone)

  // conditionally show the year only if it is not this year
  const isTsThisYear = isThisYear(new Date(tsToFormat * 1000))
  const fullDisplay = isTsThisYear
    ? shortTimeDisplay
    : `${shortTimeDisplay} ${yearDisplay}`

  return (
    <Grid
      container
      direction='row'
      alignItems='center'
      classes={{ root: clsx(classes.noWrapGrid, classes.timeLineItem) }}
    >
      <Grid style={{ marginRight: 10 }}>
        <Grid />
        <Grid
          item
          classes={{ root: clsx(flexClasses.centerAround, flexClasses.row) }}
        >
          {userData && (
            <Tooltip
              content={<TooltipText>{userName}</TooltipText>}
              placement='bottom'
            >
              <div>
                <UserAvatar
                  img={userData.img}
                  name={userName}
                  size={32}
                  key={`lastTimelineEventCardAvatar-${timeline.id}`}
                />
              </div>
            </Tooltip>
          )}
        </Grid>
      </Grid>
      <div
        className={clsx({ [classes.chatBox]: isComment })}
        style={{ width: '100%' }}
      >
        <div className={clsx('am-caption', classes.timeLineItemTitle)}>
          {userName}
        </div>
        <div
          id='timeline-item-text'
          className={clsx(
            isEmpty(userName) ? 'am-subtitle2' : 'am-caption', // make the text smaller when username
            classes.timeLineItemText,
          )}
        >
          {editMode ? (
            <TextField
              id='edit-comment'
              label='Comment'
              value={editComment}
              onChange={event => setEditComment(event.target.value)}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  onUpdate(event, id, editComment)
                  setEditMode(false)
                }
              }}
            />
          ) : (
            decoratedText
          )}
        </div>
        <div className={classes.timeLineItemText}>{contactInfo}</div>
        <div
          className={clsx(
            'am-caption',
            classes.timeLineItemTimeAgo,
            cursorClasses.pointer,
          )}
        >
          <div className={clsx(flexClasses.row, flexClasses.centerBetween)}>
            <span>{getElapsedTime(ts, true)}</span>
            <span style={{ marginLeft: 24 }}>{fullDisplay}</span>
          </div>
        </div>
      </div>
      {isComment && get(authUser, 'id') === author.user.id && (
        <div className={classes.manageIcons}>
          <MoreOptionMenu
            customIconContainer={false}
            darkMode
            lightIcon
            icon={<div>ʕ•ᴥ•ʔ</div>}
            menuItems={[
              {
                label: 'Edit',
                onClick: onEdit,
                value: 'edit',
              },
              {
                label: 'Delete',
                onClick: event => onDelete(event, id),
                value: 'delete',
              },
            ]}
            noBackground
            textClass='am-caption'
          />
          {edited && (
            <div className={clsx('am-caption', classes.edit)}>(edited)</div>
          )}
        </div>
      )}
    </Grid>
  )
}

TimelineItem.propTypes = propTypes
TimelineItem.defaultProps = defaultProps

export default TimelineItem
