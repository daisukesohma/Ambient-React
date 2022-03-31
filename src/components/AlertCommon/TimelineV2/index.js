/* eslint-disable */
import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { CircularProgress, Icons } from 'ambient_ui'
import first from 'lodash/first'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import times from 'lodash/times'
import find from 'lodash/find'
import get from 'lodash/get'
import { Grid, LinearProgress, Typography, TextField } from '@material-ui/core'
// src
import { useFlexStyles } from 'common/styles/commonStyles'

import useStyles from './styles'
import TimeLineItem from './TimelineItem'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import getElapsedTime, {
  getElapsedTimeBetweenDates,
} from 'utils/dateTime/getElapsedTime'

const { Send } = Icons

const TimelineV2 = ({
  timeline,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  resolved,
  timezone,
  alertTs,
}) => {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()

  const [comment, setComment] = useState('')

  const recentLine = useMemo(
    () =>
      first(
        timeline.filter(
          line =>
            line.__typename !== 'AlertEventShareType' &&
            line.__typename !== 'CommentType',
        ),
      ),
    [timeline],
  )

  const resolvedLine = useMemo(
    () =>
      find(timeline, {
        __typename: 'AlertEventStatusType',
        status: 'resolved',
      }),
    [timeline],
  )
  const isValid = useMemo(() => comment.trim().length > 0, [comment])

  const completedLevel = useMemo(() => {
    if (resolved) return 5
    if (isEmpty(recentLine)) return 1
    if (
      isEqual(recentLine.status, 'raised') &&
      isEqual(recentLine.__typename, 'AlertEventStatusType')
    )
      return 1
    if (
      isEqual(recentLine.status, 'requested') &&
      isEqual(recentLine.__typename, 'AlertEventDispatchType')
    )
      return 2
    if (
      isEqual(recentLine.status, 'confirmed') &&
      isEqual(recentLine.__typename, 'AlertEventDispatchType')
    )
      return 3
    if (
      isEqual(recentLine.status, 'arrived') &&
      isEqual(recentLine.__typename, 'AlertEventDispatchType')
    )
      return 4
  }, [recentLine])

  const bottomRef = useRef(null)
  const [userCommentAdded, setCommentAdded] = useState(true)

  const sendComment = () => {
    if (isValid) {
      onAddComment(comment)
      setComment('')
      setCommentAdded(true)
    }
  }

  const classes = useStyles({ isValid })

  const progressText = useMemo(() => {
    if (resolved) return 'Alert Resolved'
    if (isEmpty(recentLine)) return 'Alert Outstanding'
    if (
      isEqual(recentLine.status, 'raised') &&
      isEqual(recentLine.__typename, 'AlertEventStatusType')
    ) {
      return 'Alert Outstanding'
    } else {
      return 'Dispatch in progress'
    }
  }, [resolved, recentLine])

  useEffect(() => {
    // timeline.length > 1 because alert timeline will always start with 1.
    if (
      bottomRef &&
      bottomRef.current &&
      userCommentAdded &&
      timeline.length > 1
    ) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setCommentAdded(false)
    }
  }, [timeline, bottomRef])

  if (!timeline) return <CircularProgress />
  // if (isEmpty(timeline)) return false

  return (
    <Grid
      container
      direction={'column'}
      style={{ height: '100%' }}
      classes={{ root: classes.NoWrapGrid }}
    >
      <Grid
        container
        direction={'column'}
        className={classes.TimeLineItemHeader}
      >
        <Grid
          container
          direction={'row'}
          classes={{ root: classes.NoWrapGrid }}
        >
          <Grid container direction={'column'}>
            <Grid
              container
              direction={'row'}
              classes={{ root: flexClasses.centerBetween }}
            >
              <Grid>
                <Typography>{progressText}</Typography>
              </Grid>
              <Grid>
                <Typography>
                  {resolved
                    ? getElapsedTimeBetweenDates(
                        get(resolvedLine, 'ts', alertTs + 60),
                        alertTs,
                      )
                    : getElapsedTime(alertTs)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction='row'
          className={classes.LinearProgressRoot}
        >
          {times(completedLevel, index => (
            <Grid
              key={`alert-level-${index}`}
              item
              lg={2}
              md={2}
              sm={2}
              xs={2}
              className={classes.lineItem}
            >
              <LinearProgress variant='determinate' value={100} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid
        style={{
          height: '100%',
          overflowY: 'auto',
          maxHeight: 610,
          flexWrap: 'nowrap',
          display: 'block',
        }}
        container
        direction={'column'}
      >
        {timeline
          .filter(line => line.__typename !== 'AlertEventShareType')
          .sort((a, b) => (a.ts > b.ts ? 1 : -1))
          .map((line, index) => (
            <TimeLineItem
              key={`${line.id}-timeline-${index}`}
              timeline={line}
              onDelete={onDeleteComment}
              onUpdate={onUpdateComment}
              timezone={timezone}
              alertTs={alertTs}
            />
          ))}
        <div ref={bottomRef} />
      </Grid>
      <Grid classes={{ root: classes.TimeLineFooter }}>
        <TextField
          multiline
          rows={4}
          placeholder={'Start typing...'}
          fullWidth
          onChange={event => setComment(event.target.value)}
          value={comment}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              sendComment()
            }
          }}
          InputProps={{
            disableUnderline: true,
          }}
        />
        <div
          onClick={event => {
            event.stopPropagation()
            sendComment()
          }}
          className={classes.sendButton}
        >
          <Send
            width={24}
            height={24}
            stroke={isValid ? palette.primary.main : palette.grey[500]}
          />
        </div>
      </Grid>
    </Grid>
  )
}

TimelineV2.defaultProps = {
  timeline: [],
  onAddComment: () => {},
  onUpdateComment: () => {},
  onDeleteComment: () => {},
  timezone: DEFAULT_TIMEZONE,
}

TimelineV2.propTypes = {
  timeline: PropTypes.array,
  onAddComment: PropTypes.func,
  onUpdateComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  timezone: PropTypes.string,
  alertTs: PropTypes.number.isRequired,
}

export default TimelineV2
