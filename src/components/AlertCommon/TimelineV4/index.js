import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useTheme } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { CircularProgress, Icons } from 'ambient_ui'
import first from 'lodash/first'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import times from 'lodash/times'
import find from 'lodash/find'
import get from 'lodash/get'

import { useFlexStyles } from '../../../common/styles/commonStyles'
import { Grid, LinearProgress, Typography, TextField } from '@material-ui/core'

import useStyles from './styles'
import TimeLineItem from './TimelineItem'
import { setIsAlertCommentFocused } from 'redux/slices/videoStreamControls'
import { DEFAULT_TIMEZONE } from 'utils/dateTime/formatTimeWithTZ'
import getElapsedTime, {
  getElapsedTimeBetweenDates,
} from 'utils/dateTime/getElapsedTime'

const TimelineV4 = ({
  timeline,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  resolved,
  timezone,
  initTs,
}) => {
  const { palette } = useTheme()
  const flexClasses = useFlexStyles()
  const dispatch = useDispatch()
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
    return 1
  }, [recentLine])

  const [userCommentAdded, setCommentAdded] = useState(true)

  const sendComment = () => {
    if (isValid) {
      onAddComment(comment)
      setComment('')
      setCommentAdded(true)
    }
  }

  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ isValid, darkMode })

  const progressText = useMemo(() => {
    if (resolved) return 'Alert Resolved'
    if (isEmpty(recentLine)) return 'Alert Outstanding'
    if (
      isEqual(recentLine.status, 'raised') &&
      isEqual(recentLine.__typename, 'AlertEventStatusType')
    ) {
      return 'Alert Outstanding'
    }
    return 'Dispatch in progress'
  }, [resolved, recentLine])

  const bottomRef = useRef(null)

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

  if (isEmpty(timeline)) return <CircularProgress />

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
                        get(resolvedLine, 'ts', initTs + 60),
                        initTs,
                      )
                    : getElapsedTime(initTs)}
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
      <div className={classes.TimeLineBody}>
        {timeline
          .filter(line => line.__typename !== 'AlertEventShareType')
          .reverse()
          .map((line, index) => (
            <TimeLineItem
              key={`${line.id}-timeline-${index}`}
              isFirstItem={index === 0}
              timeline={line}
              onDelete={onDeleteComment}
              onUpdate={onUpdateComment}
              timezone={timezone}
              initTs={initTs}
            />
          ))}
        <div ref={bottomRef} />
      </div>
      <Grid classes={{ root: classes.TimeLineFooter }}>
        <TextField
          multiline
          rows={4}
          onFocus={() => dispatch(setIsAlertCommentFocused(true))}
          onBlur={() => dispatch(setIsAlertCommentFocused(false))}
          placeholder={'Write new comment on alert...'}
          fullWidth
          onChange={event => setComment(event.target.value)}
          value={comment}
          onKeyPress={event => {
            // turn off keypress container
            if (event.key === 'Enter') {
              event.preventDefault()
              sendComment()
            }
          }}
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.textField },
          }}
        />
        <div
          onClick={event => {
            event.stopPropagation()
            sendComment()
          }}
          className={classes.sendButton}
        >
          <Icons.Send
            width={24}
            height={24}
            stroke={isValid ? palette.primary.main : palette.common.white}
          />
        </div>
      </Grid>
    </Grid>
  )
}

TimelineV4.defaultProps = {
  timeline: [],
  onAddComment: () => {},
  onUpdateComment: () => {},
  onDeleteComment: () => {},
  timezone: DEFAULT_TIMEZONE,
}

TimelineV4.propTypes = {
  timeline: PropTypes.array,
  onAddComment: PropTypes.func,
  onUpdateComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  timezone: PropTypes.string,
}

export default TimelineV4
