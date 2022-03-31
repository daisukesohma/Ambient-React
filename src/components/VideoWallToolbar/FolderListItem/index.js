/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MoreOptionMenu } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { Icon } from 'react-icons-kit'
import get from 'lodash/get'
import { folderOpen } from 'react-icons-kit/fa/folderOpen'
import { folder as folderIcon } from 'react-icons-kit/fa/folder'
import truncate from 'lodash/truncate'

import Tooltip from '../../Tooltip'
import TooltipText from '../../Tooltip/TooltipText'
import {
  videoWallEditRequested,
  folderDestroyRequested,
  folderEditRequested,
} from '../videoWallToolbarSlice'
import { FOLDER_TRUNCATE_LENGTH } from '../constants'

import useStyles from './styles'

const propTypes = {
  folder: PropTypes.object,
  isFolderExpanded: PropTypes.bool,
  toggleExpanded: PropTypes.func,
  isPublicFolder: PropTypes.bool,
  enableManage: PropTypes.bool,
}

function FolderListItem({
  folder,
  isPublicFolder,
  isFolderExpanded,
  toggleExpanded,
  enableManage,
}) {
  const { palette } = useTheme()
  const darkMode = useSelector(state => state.settings.darkMode)
  const activeVideoWall = useSelector(state => state.videoWall.activeVideoWall)
  const currentUserId = useSelector(state => state.auth.user.id)
  const isActive = get(activeVideoWall, 'folder.id') === folder.id

  const classes = useStyles({ isActive, darkMode })
  const dispatch = useDispatch()
  const inputEl = useRef(null)
  const [name, updateName] = useState(folder.name)
  const [isRenameMode, toggleRenameMode] = useState(folder.editMode || false)
  // autofocus for edit mode
  useEffect(() => {
    if (isRenameMode && inputEl.current) {
      inputEl.current.children[0].focus()
      inputEl.current.children[0].select()
    }
  }, [isRenameMode])

  const onApply = () => {
    dispatch(
      videoWallEditRequested({
        variables: { videoWallId: activeVideoWall.id, folderId: folder.id },
        folderUpdated:
          !activeVideoWall.folder || activeVideoWall.folder.id !== folder.id,
      }),
    )
    toggleExpanded()
  }

  const onRename = () => {
    if (isRenameMode && folder.name !== name) {
      // only dispatch action if the name has been changed
      dispatch(folderEditRequested({ name, folderId: folder.id }))
    }

    toggleRenameMode(!isRenameMode)
  }

  const onDelete = () => {
    const { id } = folder
    dispatch(folderDestroyRequested({ folderId: id }))
  }

  const defaultMenuItems = [
    {
      label: isRenameMode ? 'Save' : 'Rename',
      onClick: onRename,
    },
    {
      label: 'Delete',
      onClick: onDelete,
    },
  ]

  return (
    <List disablePadding>
      <ListItem
        onClick={() => {
          if (!isRenameMode) {
            toggleExpanded()
          }
        }}
        classes={{
          root: classes.listItemRoot,
          selected: darkMode ? classes.selectedBlack : classes.selectedWhite,
          container: classes.listItemContainer,
        }}
      >
        <Icon
          icon={isFolderExpanded ? folderOpen : folderIcon}
          style={{
            color: darkMode ? palette.common.white : palette.grey[800],
            marginRight: 16,
          }}
          size={18}
        />
        {isRenameMode && (
          <TextField
            InputProps={{
              ref: inputEl,
              className: classes.textFieldRoot,
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onRename()
              }
            }}
            label='Folder Name'
            fullWidth
            classes={{ root: 'am-subtitle1' }}
            value={name}
            onChange={e => updateName(e.currentTarget.value)}
            onBlur={onRename}
          />
        )}

        {!isRenameMode && (
          <Tooltip
            placement='bottom-start'
            content={<TooltipText>{name}</TooltipText>}
          >
            <span>
              <ListItemText
                classes={{ primary: 'am-subtitle1' }}
                primary={truncate(name, {
                  length: FOLDER_TRUNCATE_LENGTH,
                })}
              />
            </span>
          </Tooltip>
        )}

        {enableManage && !isPublicFolder && (
          <ListItemSecondaryAction className={classes.listActionContainer}>
            <MoreOptionMenu
              noBackground
              darkMode={darkMode}
              menuItems={
                get(activeVideoWall, 'owner.user.id') === currentUserId
                  ? [
                      {
                        label: 'Add Current Video Wall To Folder',
                        onClick: onApply,
                      },
                      ...defaultMenuItems,
                    ]
                  : defaultMenuItems
              }
            />
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </List>
  )
}

FolderListItem.propTypes = propTypes
FolderListItem.defaultProps = {
  isFolderExpanded: false,
  isPublicFolder: false,
  toggleExpanded: () => {},
}

export default FolderListItem
