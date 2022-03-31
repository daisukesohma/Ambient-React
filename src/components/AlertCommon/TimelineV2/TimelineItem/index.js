import React, { useMemo, useState } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Icons } from 'ambient_ui'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'
import toLower from 'lodash/toLower'
import get from 'lodash/get'
import strReplace from 'react-string-replace'
import {
  DEFAULT_TIMEZONE,
  formatUnixTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'
import { getElapsedTime } from 'utils'

import statuses from '../../../AlertEventCard/components/AlertEventTicker/statuses-map'
import { useFlexStyles } from '../../../../common/styles/commonStyles'
import UserAvatar from '../../../UserAvatar'

import useStyles from './styles'

const { Trash, Edit } = Icons

const TimelineItem = ({
  timeline,
  color,
  onDelete,
  onUpdate,
  timezone,
  alertTs,
}) => {
  const { palette } = useTheme()
  const colorMap = {
    secondary: palette.common.greenPastel,
    red: palette.error.main,
    yellow: palette.warning.main,
    primary: palette.primary.main,
  }
  const flexClasses = useFlexStyles()

  const [editComment, setEditComment] = useState('')
  const [editMode, setEditMode] = useState(false)
  const authUser = useSelector(state => state.auth.user)
  const {
    id,
    user,
    contact,
    profile,
    author,
    status,
    __typename,
    ts,
    comment,
    edited,
    createdBy,
  } = timeline

  // NOTE: This dirty code was provoked by BE response. We have 3 different keys for user: user, profile, author.

  const [text, variant] = useMemo(() => {
    if (isEmpty(__typename) || isEmpty(status)) return ['', null]
    let variantColor = 'red'
    if (__typename === 'AlertEventDispatchType') {
      if (status === 'confirmed' || status === 'arrived') {
        variantColor = 'yellow'
      } else if (status === 'resolved') {
        variantColor = 'primary'
      }
    }
    const outputStatus = [statuses[__typename][toLower(status)], variantColor]
    if (
      __typename === 'AlertEventDispatchType' &&
      status === 'requested' &&
      createdBy
    ) {
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
    if (isComment) return `says "${comment}"`
    return strReplace(text, /%(.*?)%/g, (match, index) => (
      <b
        style={{ color: colorMap[variant] }}
        key={`${timeline.id}-timeline-item-template-${index}`}
      >
        {match}
      </b>
    ))
  }, [isComment, comment, text, variant, timeline.id])

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
      <div className={classes.timelineContact}>
        <div className={classes.timelineContactMethod}>
          {`by ${contactData.method.toLowerCase()} to `}
        </div>
        <UserAvatar
          img={contactData.img}
          name={contactName}
          size={24}
          key={`contactAvatar-${timeline.id}`}
        />
        <div className={classes.timelineContactName}>{`${contactName}`}</div>
      </div>
    </span>
  )

  const onEdit = () => {
    setEditComment(!editMode ? comment : '')
    setEditMode(!editMode)
  }

  if (isEmpty(decoratedText)) return false

  let timeDisplay = formatUnixTimeWithTZ(ts, 'hh:mm:ss aa zzz', timezone)

  if (status === 'raised') {
    timeDisplay = formatUnixTimeWithTZ(alertTs, 'hh:mm:ss aa zzz', timezone)
  }

  return (
    <Grid
      container
      direction='row'
      classes={{ root: clsx(classes.noWrapGrid, classes.timeLineItem) }}
    >
      <Grid style={{ marginRight: 30 }}>
        <Grid>
          <Typography classes={{ root: classes.timeLineItemTime }}>
            {timeDisplay}
          </Typography>
        </Grid>
        <Grid
          item
          classes={{ root: clsx(flexClasses.centerAround, flexClasses.row) }}
        >
          {userData && (
            <UserAvatar
              img={userData.img}
              name={userName}
              size={32}
              key={`lastTimelineEventCardAvatar-${timeline.id}`}
            />
          )}
        </Grid>
      </Grid>
      <Grid>
        <Grid item classes={{ root: classes.timeLineItemTitle }}>
          {userName}
        </Grid>
        <Grid item classes={{ root: classes.timeLineItemText }}>
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
        </Grid>
        <Grid item classes={{ root: classes.timeLineItemText }}>
          {contactInfo}
        </Grid>
        <Grid item classes={{ root: classes.timeLineItemTimeAgo }}>
          {getElapsedTime(ts, true)}
        </Grid>
      </Grid>
      {isComment && get(authUser, 'id') === author.user.id && (
        <div className={classes.manageIcons}>
          <span
            onClick={onEdit}
            style={{
              marginRight: '8px',
            }}
          >
            <Edit width={18} height={18} />
          </span>
          <span onClick={event => onDelete(event, id)}>
            <Trash width={18} height={18} />
          </span>
          {edited && <Typography variant='subtitle1'>(edited)</Typography>}
        </div>
      )}
    </Grid>
  )
}

TimelineItem.defaultProps = {
  color: '#626469',
  onDelete: () => {},
  timezone: DEFAULT_TIMEZONE,
}

TimelineItem.propTypes = {
  timeline: PropTypes.object,
  color: PropTypes.string,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  timezone: PropTypes.string,
  alertTs: PropTypes.number.isRequired,
}

export default TimelineItem
