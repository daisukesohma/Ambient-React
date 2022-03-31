/* eslint-disable camelcase */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { MoreOptionMenu, Icons } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { useParams, useHistory } from 'react-router-dom'
import truncate from 'lodash/truncate'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import { lock } from 'react-icons-kit/feather/lock'
import { Icon } from 'react-icons-kit'

import IndicatorStatusBadge from '../../IndicatorStatusBadge'
import Tooltip from '../../Tooltip'
import TooltipText from '../../Tooltip/TooltipText'
import {
  videoWallDestroyRequested,
  videoWallEditRequested,
} from '../videoWallToolbarSlice'
import { addVideoWallRequested } from '../../VideoWallPlayer/videoWallPlayerSlice'
import {
  PUBLIC_WALL_TRUNCATE_LENGTH,
  VIDEO_WALL_TRUNCATE_LENGTH,
} from '../constants'
import isAdminSelector from 'selectors/auth/isAdmin'
import useFeature from '../../../common/hooks/useFeature'

import useStyles from './styles'

const { Check } = Icons

const propTypes = {
  videoWall: PropTypes.object,
  activeVideoWall: PropTypes.object,
  onFolderTree: PropTypes.bool,
  focusedRename: PropTypes.bool,
  isPublicVideoWall: PropTypes.bool,
  isVideoWallUnderFolder: PropTypes.bool,
  isEdit: PropTypes.bool,
  enableManage: PropTypes.bool,
  addToPlayer: PropTypes.bool,
  onVideoWallSelect: PropTypes.func,
}

const defaultProps = {
  onFolderTree: false,
  videoWall: {
    id: 0,
    name: '',
  },
  isPublicVideoWall: false,
  isVideoWallUnderFolder: false,
  isEdit: false,
  enableManage: true,
  addToPlayer: false,
  onVideoWallSelect: () => {},
}

function VideoWallListItem({
  videoWall,
  activeVideoWall,
  isPublicVideoWall,
  isVideoWallUnderFolder,
  onFolderTree,
  focusedRename,
  isEdit,
  enableManage,
  addToPlayer,
  onVideoWallSelect,
}) {
  const { palette } = useTheme()
  const inputEl = useRef(null)
  const darkMode = useSelector(state => state.settings.darkMode)
  const currentUserId = useSelector(state => state.auth.user.id)
  const isInternal = useSelector(state => state.auth.user.internal)
  const isAdmin = useSelector(isAdminSelector)

  const dispatch = useDispatch()
  const { account } = useParams()
  const history = useHistory()
  const classes = useStyles({ darkMode, onFolderTree })

  const isOwner = useMemo(
    () => isEqual(get(videoWall, 'owner.user.id'), currentUserId),
    [videoWall, currentUserId],
  )

  const isVideoWallPlayerActive = useFeature({
    accountSlug: account,
    feature: 'VIDEO_WALL_PLAYER',
  })

  const activeVideoWallId = get(activeVideoWall, 'id', null)
  const videoWallTruncateLength = isVideoWallUnderFolder
    ? VIDEO_WALL_TRUNCATE_LENGTH - 4
    : VIDEO_WALL_TRUNCATE_LENGTH

  const [name, updateName] = useState(videoWall.name)
  const [isRenameMode, toggleRenameMode] = useState(false)

  useEffect(() => {
    updateName(videoWall.name)
    toggleRenameMode((videoWall.editMode && focusedRename) || false)
  }, [videoWall, focusedRename])

  // autofocus for edit mode
  useEffect(() => {
    if (isRenameMode && inputEl.current) {
      inputEl.current.children[0].focus()
      inputEl.current.children[0].select()
    }
  }, [isRenameMode])

  const onRename = useCallback(() => {
    if (isRenameMode && videoWall.name !== name) {
      // only dispatch action if the name has been changed
      dispatch(
        videoWallEditRequested({
          variables: { name, videoWallId: videoWall.id },
        }),
      )
    }

    toggleRenameMode(!isRenameMode)
  }, [isRenameMode, videoWall, name, dispatch])

  const onEdit = () => {
    const prefix = isEdit ? '' : '/edit'
    history.push(`/accounts/${account}/video-walls/${videoWall.id}${prefix}`)
  }

  const onDelete = useCallback(() => {
    dispatch(videoWallDestroyRequested({ videoWall }))
  }, [dispatch, videoWall])

  const handlerAddToPlayer = useCallback(() => {
    dispatch(addVideoWallRequested({ videoWall, account }))
  }, [dispatch, videoWall, account])

  const menuOptions = useMemo(() => {
    const options = []
    if (addToPlayer && isVideoWallPlayerActive) {
      options.push({
        label: 'Add to Player',
        onClick: handlerAddToPlayer,
      })
    }

    if (enableManage && (isOwner || isAdmin || isInternal)) {
      options.push({
        label: isEdit ? 'Show' : 'Edit',
        onClick: onEdit,
      })
      options.push({
        label: isRenameMode ? 'Save' : 'Rename',
        onClick: onRename,
      })
      options.push({
        label: 'Delete',
        onClick: onDelete,
      })
    }

    return options
  }, [
    isEdit,
    isAdmin,
    isInternal,
    isOwner,
    isRenameMode,
    enableManage,
    onEdit,
    onRename,
    onDelete,
    addToPlayer,
    isVideoWallPlayerActive,
    handlerAddToPlayer,
  ])

  return (
    <List disablePadding>
      <ListItem
        selected={videoWall === activeVideoWall}
        classes={{
          root: classes.listItemRoot,
          selected: darkMode ? classes.selectedBlack : classes.selectedWhite,
          container: classes.listItemContainer,
        }}
      >
        {isRenameMode && (
          <TextField
            InputProps={{
              ref: inputEl,
              className: classes.textFieldRoot,
            }}
            label='Video Wall Name'
            fullWidth
            value={name}
            onChange={e => updateName(e.currentTarget.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onRename()
              }
            }}
          />
        )}
        {isRenameMode && (
          <span
            style={{
              marginRight: '12px',
              marginTop: '-2px',
            }}
            onClick={onRename}
          >
            <Check stroke={palette.primary.main} onClick={onRename} />
          </span>
        )}

        {!isRenameMode && (
          <a // eslint-disable-line
            className={classes.link}
            onClick={() => onVideoWallSelect(videoWall)}
          >
            {videoWall.id === activeVideoWallId && (
              <div style={{ marginLeft: -34 }}>
                <IndicatorStatusBadge
                  showLivePulse
                  display='block'
                  variant='naked'
                  pulseColor='red'
                  pulseRippleColor='red'
                  style={{ position: null }} // override absolute positioning
                />
              </div>
            )}
            {videoWall.id !== activeVideoWallId &&
              !isPublicVideoWall &&
              !videoWall.public && (
                <span className={classes.lockIconContainer}>
                  <Icon icon={lock} />
                </span>
              )}
            <Tooltip
              placement='bottom-start'
              content={<TooltipText>{name}</TooltipText>}
            >
              <ListItemText
                classes={{ primary: 'am-subtitle1' }}
                primary={truncate(name, {
                  length: isPublicVideoWall
                    ? PUBLIC_WALL_TRUNCATE_LENGTH
                    : videoWallTruncateLength,
                })}
              />
            </Tooltip>
          </a>
        )}

        {!isEmpty(menuOptions) && (
          <ListItemSecondaryAction>
            <MoreOptionMenu
              noBackground
              darkMode={darkMode}
              menuItems={menuOptions}
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </List>
  )
}

VideoWallListItem.propTypes = propTypes
VideoWallListItem.defaultProps = defaultProps

export default VideoWallListItem
