import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, Icons } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import get from 'lodash/get'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { formatUnixTimeWithTZ } from 'utils/dateTime/formatTimeWithTZ'
import { hexRgba, getElapsedTime, msToUnix } from 'utils'

import AlertEventTicker from '../AlertEventTicker'
import disableDropAnimationStyle from 'utils/disableDropAnimationStyle'
import iconsMap from '../../iconsMap'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'

const propTypes = {
  activityVersion: PropTypes.bool,
  alertEvent: PropTypes.object,
  hovered: PropTypes.bool,
  index: PropTypes.number,
  initialExpanded: PropTypes.bool,
  isDispatchLoading: PropTypes.bool,
  operatorPage: PropTypes.bool,
}

const defaultProps = {
  activityVersion: false,
  alertEvent: null,
  hovered: false,
  index: 0,
  initialExpanded: false,
  isDispatchLoading: false,
  operatorPage: false,
}

// const ICON_SIZE = 20

const AlertHeader = ({
  alertEvent,
  hovered,
  isDispatchLoading,
  index,
  operatorPage,
}) => {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  // const dismissLoading = useSelector(state => state.feed.dismissLoading)
  // const dispatch = useDispatch()
  const classes = useStyles({ darkMode, hovered })
  const alertTime = msToUnix(get(alertEvent, 'tsIdentifier'))
  const timeAgoValue = getElapsedTime(alertTime, true)
  const timezone = get(alertEvent, 'stream.site.timezone')
  const [timeAgo, setTimeAgo] = useState(timeAgoValue)
  useEffect(() => {
    // dispatch(alertEventPollRequested(alertEvent.id))
    const interval = setInterval(() => {
      setTimeAgo(getElapsedTime(alertTime, true))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [alertEvent])

  const stream = get(alertEvent, 'stream', null)
  const readableTime = formatUnixTimeWithTZ(alertTime, 'HH:mm:ss zzz', timezone)

  // const handleDismiss = () => {
  //   dispatch(
  //     setDismissModalOpen({
  //       alertEventId: alertEvent.id,
  //       alertEventHash: alertEvent.eventHash,
  //     }),
  //   )
  // }

  const AlertIcon =
    Icons[iconsMap[get(alertEvent, 'alert.threatSignature.icon', '')]] ||
    Icons.AlertCircle

  const moveIcon = dragging => (
    <Typography style={{ display: hovered || dragging ? null : 'none' }}>
      <Icons.Move stroke={hexRgba(palette.grey[500], 0.5)} />
    </Typography>
  )
  const accessReaderDeviceId = get(alertEvent, 'accessReader.deviceId')
  return (
    <Grid container>
      <Grid container className={classes.headerLine}>
        <Grid
          item
          container
          direction='column'
          justify='center'
          alignItems='center'
          lg={1}
          md={1}
          sm={3}
          xs={3}
          className={classes.iconContainer}
        >
          <AlertIcon
            stroke={hexRgba(palette.grey[700], 0.8)}
            height={20}
            width={20}
          />
        </Grid>

        <Grid
          item
          container
          direction='column'
          justify='flex-start'
          alignItems='flex-start'
          lg={11}
          md={11}
          sm={8}
          xs={8}
        >
          <div className={clsx('am-subtitle2', classes.primaryText)}>
            {get(alertEvent, 'alert.name', 'Alert Name')}
            {/* {dismissLoading ? (
                <CircularProgress size={ICON_SIZE} />
              ) : (
                <Grid item className={classes.moreOptions}>
                  <MoreOptionMenu
                    darkMode={darkMode}
                    iconSize={20}
                    menuItems={[
                      {
                        label: 'Mark as False Alert',
                        onClick: () => {
                          handleDismiss()
                        },
                      },
                    ]}
                  />
                </Grid>
              )} */}
          </div>
          <div className={clsx('am-caption', classes.secondaryText)}>
            {get(alertEvent, 'alert.site.name', '')}
          </div>
          <div className={classes.infoContainer}>
            <Tooltip
              placement='bottom-start'
              content={
                <TooltipText
                  text={get(alertEvent, 'alert.site.name', 'Site')}
                />
              }
            >
              <div className={clsx('am-caption', classes.secondaryText)}>
                {get(
                  alertEvent,
                  'stream.name',
                  accessReaderDeviceId || 'No Stream',
                )}
              </div>
            </Tooltip>
            <div className={clsx('am-caption', classes.secondaryText)}>
              <Tooltip
                placement='bottom-start'
                content={<TooltipText text={readableTime} />}
              >
                <span>{timeAgo}</span>
              </Tooltip>
            </div>
          </div>
        </Grid>

        <div
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          {operatorPage && stream && (
            <Draggable
              key={alertEvent.id}
              draggableId={`${alertEvent.id}-${get(alertEvent, 'stream.id')}`}
              index={index}
            >
              {(
                { innerRef, draggableProps, dragHandleProps },
                { isDragging, isDropAnimating },
              ) => (
                <>
                  <div
                    ref={innerRef}
                    {...draggableProps}
                    {...dragHandleProps}
                    style={disableDropAnimationStyle(
                      draggableProps.style,
                      isDragging,
                      isDropAnimating,
                    )}
                  >
                    <Tooltip content='Drag Alert to Stream Panel'>
                      {moveIcon(isDragging)}
                    </Tooltip>
                  </div>
                  {isDragging && moveIcon(isDragging)}
                </>
              )}
            </Draggable>
          )}
        </div>
      </Grid>
      <Grid container className={classes.headerLine}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {isDispatchLoading ? (
            <CircularProgress size={24} />
          ) : (
            alertEvent.lastTimelineEvent && (
              <AlertEventTicker
                lastTimelineEvent={alertEvent.lastTimelineEvent}
              />
            )
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

AlertHeader.propTypes = propTypes
AlertHeader.defaultProps = defaultProps

export default AlertHeader
