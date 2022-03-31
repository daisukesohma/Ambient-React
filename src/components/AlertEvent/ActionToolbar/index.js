/*
 * author: rodaan@ambient.ai
 * The BottomToolbar used in investigations and ActivityDashboard
 * May want to extend this for different container types
 * Uses ApolloClient Provider to access GraphQL
 * Meant to be independent so it doesn't rely on other components for things to work
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
} from '@material-ui/icons'
import { get } from 'lodash'
import clsx from 'clsx'

// src
import { showModal } from 'redux/slices/modal'
import { Icon, Icons } from 'ambient_ui'
import { ModalTypeEnum } from 'enums'
import Tooltip from 'components/Tooltip'
import TooltipText from 'components/Tooltip/TooltipText'

import useStyles from './styles'

const { Check } = Icons
const iconSize = 24

function BottomToolbar({
  alertEvent,
  handleResolveAlert,
  handleBookmark,
  isBookmarkShown,
  darkMode,
}) {
  const { palette } = useTheme()
  const dispatch = useDispatch()
  const classes = useStyles()
  const isResolved = alertEvent.resolved
  const isSpotlighted = alertEvent.bookmarked

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

  const isStreamActive = get(alertEvent, 'stream.active', false)

  // FUTURE: Spotlight status to know whether to "add" or "remove " from spotlight, and add fill color
  //
  return (
    <div className={classes.root}>
      <Tooltip
        placement='bottom'
        content={
          <TooltipText>
            {isStreamActive ? 'View Details' : "Stream inactive"}
          </TooltipText>
        }
      >
        <IconButton
          disabled={!isStreamActive}
          onClick={handleClick}
          className={classes.button}
        >
          { isStreamActive && <VisibilityOutlinedIcon fontSize="small" htmlColor={palette.text.primary} /> }
          { !isStreamActive && <VisibilityOffOutlinedIcon fontSize="small" htmlColor={palette.text.primary} /> }
        </IconButton>
      </Tooltip>
      {isBookmarkShown && (
        <Tooltip
          placement='bottom'
          content={
            <TooltipText>
              {isSpotlighted ? 'Remove from Spotlight' : 'Add to Spotlight'}
            </TooltipText>
          }
        >
          <IconButton
            onClick={() => handleBookmark(alertEvent)}
            className={clsx(classes.button, classes.bookmark)}
          >
            <Icon
              icon='bookmark'
              color={palette.warning.main}
              fill={
                alertEvent.bookmarked ? palette.warning.main : 'transparent'
              }
              size={iconSize - 4}
            />
          </IconButton>
        </Tooltip>
      )}
      {handleResolveAlert && (
        <Tooltip
          placement='bottom'
          content={
            <TooltipText>{isResolved ? 'Resolved' : 'Resolve'}</TooltipText>
          }
        >
          <IconButton
            onClick={handleAck}
            disabled={isResolved}
            className={classes.button}
          >
            {isResolved ? (
              <Icon
                icon='checkCircle'
                color={darkMode ? palette.common.white : palette.grey[500]}
                size={iconSize}
              />
            ) : (
              <Check
                stroke={palette.primary.main}
                width={iconSize}
                height={iconSize}
              />
            )}
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

BottomToolbar.propTypes = {
  handleResolveAlert: PropTypes.func,
  alertEvent: PropTypes.shape({
    alert: PropTypes.shape({
      site: PropTypes.shape({
        slug: PropTypes.string,
      }),
    }),
    status: PropTypes.string,
    bookmarked: PropTypes.bool,
    resolved: PropTypes.bool,
  }),
  handleBookmark: PropTypes.func,
  isBookmarkShown: PropTypes.bool,
  darkMode: PropTypes.bool,
}

BottomToolbar.defaultTypes = {
  alertEvent: {},
  handleBookmark: () => {},
  isBookmarkShown: false,
  darkMode: false,
}

export default BottomToolbar
