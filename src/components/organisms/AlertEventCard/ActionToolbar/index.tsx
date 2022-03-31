/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@material-ui/icons'
import { get } from 'lodash'
import clsx from 'clsx'
import { showModal } from 'redux/slices/modal'
import { Icon, Icons } from 'ambient_ui'
import { ModalTypeEnum } from 'enums'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'

const { Check } = Icons

interface AlertEvent {
  resolved: boolean,
  bookmarked: boolean,
}

interface Props {
  handleResolveAlert: (alertEvent: AlertEvent) => void,
  alertEvent: AlertEvent,
  handleBookmark: (alertEvent: AlertEvent) => void,
  isBookmarkShown?: boolean,
}

const defaultProps = {
  isBookmarkShown: false,
}

function ActionToolbar({
  alertEvent,
  handleResolveAlert,
  handleBookmark,
  isBookmarkShown,
}: Props): JSX.Element {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles()
  const isResolved = alertEvent.resolved
  const isSpotlighted = alertEvent.bookmarked
  const isStreamActive = get(alertEvent, 'stream.active', false)

  const handleClick = () => {
    dispatch(
      showModal({
        content: { alertEvent },
        type: ModalTypeEnum.ALERT,
      }),
    )
  }

  const handleAck = () => {
    if (!isResolved) {
      handleResolveAlert(alertEvent)
    }
  }

  return (
    <div className={classes.root}>
      {/* @ts-ignore */}
      <Tooltip
        placement='bottom'
        content={(
          <TooltipText>
            {isStreamActive ? 'View Details' : 'Stream inactive'}
          </TooltipText>
        )}
      >
        <IconButton
          disabled={!isStreamActive}
          onClick={handleClick}
          className={classes.button}
        >
          {isStreamActive && (
            <VisibilityOutlinedIcon
              fontSize='small'
              htmlColor={palette.text.primary}
            />
          )}
          {!isStreamActive && (
            <VisibilityOffOutlinedIcon
              fontSize='small'
              htmlColor={palette.text.primary}
            />
          )}
        </IconButton>
      </Tooltip>
      {isBookmarkShown && (
        // @ts-ignore
        <Tooltip
          placement='bottom'
          content={(
            <TooltipText>
              {isSpotlighted ? 'Remove from Spotlight' : 'Add to Spotlight'}
            </TooltipText>
          )}
        >
          <IconButton
            onClick={() => handleBookmark(alertEvent)}
            className={clsx(classes.button, classes.bookmark)}
          >
            {/* @ts-ignore */}
            <Icon
              icon='bookmark'
              color={palette.warning.main}
              fill={
                alertEvent.bookmarked ? palette.warning.main : 'transparent'
              }
              size={20}
            />
          </IconButton>
        </Tooltip>
      )}
      {handleResolveAlert && (
        // @ts-ignore
        <Tooltip
          placement='bottom'
          content={(
            <TooltipText>{isResolved ? 'Resolved' : 'Resolve'}</TooltipText>
          )}
        >
          <IconButton
            onClick={handleAck}
            disabled={isResolved}
            className={classes.button}
          >
            {isResolved ? (
              // @ts-ignore
              <Icon
                icon='checkCircle'
                size={24}
              />
            ) : (
              <Check
                stroke={palette.primary.main}
                width={24}
                height={24}
              />
            )}
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

ActionToolbar.defaultProps = defaultProps

export default ActionToolbar
