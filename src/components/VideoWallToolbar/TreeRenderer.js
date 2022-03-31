import React, { memo } from 'react'
import clsx from 'clsx'
import truncate from 'lodash/truncate'
import TreeItem from '@material-ui/lab/TreeItem'
import findIndex from 'lodash/findIndex'
import compact from 'lodash/compact'
import includes from 'lodash/includes'
import get from 'lodash/get'
import map from 'lodash/map'
import isArray from 'lodash/isArray'
import { Icons } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import { Draggable } from 'react-beautiful-dnd'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import LocationOn from '@material-ui/icons/LocationOn'
import Videocam from '@material-ui/icons/Videocam'

import Tooltip from '../Tooltip'
import TooltipText from '../Tooltip/TooltipText'

import VideoWallListItem from './VideoWallListItem'
import FolderListItem from './FolderListItem'
import { VIDEO_WALL_TRUNCATE_LENGTH } from './constants'

const TreeItemIcons = {
  LocationOn,
  Videocam,
  Sites: Icons.Sites,
  Folders: Icons.Folder,
  Share: Icons.Cloud,
  Users: Icons.Users,
  Video: Icons.Video,
}

function TreeRenderer({
  isEdit,
  classes,
  nodes,
  activeVideoWall,
  toolbarOpened = true,
  enableManage = true,
  addToPlayer = false,
  darkMode = false,
  toggleExpanded = () => {},
  foldersExpanded = [],
  parentId = null,
  handleStreamClick = () => {},
  onVideoWallSelect = () => {},
}) {
  const { palette } = useTheme()
  const {
    isRoot,
    isStream,
    isVideoWall,
    isPublicVideoWall,
    isPublicFolder,
    isVideoWallUnderFolder,
    isFolder,
    isActive, // if video wall or folder is seleted
    icon,
    id,
    name,
    editMode,
    children,
  } = nodes
  const TreeItemIcon = TreeItemIcons[icon]

  const isFolderExpanded =
    isFolder && findIndex(foldersExpanded, folderId => folderId === id) !== -1

  const activeVideoWallStreamIds = compact(
    map(get(activeVideoWall, 'streamFeeds'), 'streamId'),
  )

  const isOnVideoWall = !!(
    isStream && includes(activeVideoWallStreamIds, get(nodes, 'id', ''))
  )

  const treeItem = (
    <TreeItem
      key={id}
      nodeId={`${id}`} // because we need to convert number into string
      label={
        <>
          {isVideoWall && (
            <VideoWallListItem
              videoWall={{
                ...nodes,
                id,
                name,
                folderId: parentId,
                object: nodes,
              }}
              activeVideoWall={activeVideoWall}
              onFolderTree
              key={`video-wall-${id}`}
              isPublicVideoWall={isPublicVideoWall === true}
              isVideoWallUnderFolder={isVideoWallUnderFolder === true}
              isEdit={isEdit}
              enableManage={enableManage}
              addToPlayer={addToPlayer}
              onVideoWallSelect={onVideoWallSelect}
            />
          )}
          {isFolder && (
            <FolderListItem
              toggleExpanded={() => {
                toggleExpanded(id)
              }}
              folder={{ id, name, editMode }}
              isPublicFolder={!!isPublicFolder}
              key={`folder-${id}`}
              isFolderExpanded={isFolderExpanded}
              enableManage={enableManage}
            />
          )}
          {!isVideoWall && !isFolder && (
            <div
              className={clsx(
                'am-subtitle1',
                classes.treeLabelRoot,
                icon === 'Users' && classes.treeUserIcon,
              )}
              onClick={() => {
                if (isStream && !isEdit) {
                  handleStreamClick(id)
                } else {
                  toggleExpanded(id)
                }
              }}
            >
              {TreeItemIcon && isOnVideoWall && (
                <TreeItemIcon
                  style={{
                    color: palette.primary.main,
                    width: 30,
                  }}
                  className={classes.treeLabelRoot}
                  stroke={palette.primary.main}
                />
              )}
              {TreeItemIcon && !isOnVideoWall && (
                <TreeItemIcon
                  style={{
                    color: palette.text.primary,
                    width: 30,
                  }}
                  className={classes.treeLabelRoot}
                  stroke={palette.text.primary}
                />
              )}
              {toolbarOpened && (
                <Tooltip
                  placement='bottom-start'
                  content={
                    <TooltipText>
                      {isOnVideoWall ? `${name} (on wall)` : name}
                    </TooltipText>
                  }
                >
                  <span className={classes.textTruncate}>
                    {truncate(name, { length: VIDEO_WALL_TRUNCATE_LENGTH })}
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </>
      }
      classes={{
        root: darkMode ? classes.treeItemRootBlack : classes.treeItemRootWhite,
        content: clsx(
          classes.treeItemContent,
          isRoot && classes.treeItemContentRoot,
          isVideoWall && classes.treeItemContentWall,
          (isStream || isVideoWall) && classes.treeItemContentWithoutBorder,
          isActive &&
            (darkMode
              ? classes.treeItemContentSelectedBlack
              : classes.treeItemContentSelectedWhite),
        ),
        iconContainer: toolbarOpened
          ? classes.treeItemIconContainer
          : classes.treeItemIconContainerHidden,
        group: classes.treeItemGroup,
        label: classes.treeItemLabel,
      }}
      expandIcon={
        isFolder ? null : (
          <ExpandMore
            onClick={() => {
              toggleExpanded(id)
            }}
            classes={{
              root: classes['treeItem__expand-icon'],
            }}
          />
        )
      }
      collapseIcon={
        isFolder ? null : (
          <ExpandLess
            onClick={() => {
              toggleExpanded(id)
            }}
            classes={{
              root: classes['treeItem__expand-icon'],
            }}
          />
        )
      }
    >
      {isArray(children)
        ? children.map((node, index) => (
            <TreeRenderer
              key={`${node.id}-${index}`}
              activeVideoWall={activeVideoWall}
              isEdit={isEdit}
              classes={classes}
              nodes={node}
              toolbarOpened={toolbarOpened}
              darkMode={darkMode}
              toggleExpanded={toggleExpanded}
              foldersExpanded={foldersExpanded}
              parentId={id}
              handleStreamClick={handleStreamClick}
              enableManage={enableManage}
              addToPlayer={addToPlayer}
              onVideoWallSelect={onVideoWallSelect}
            />
          ))
        : null}
    </TreeItem>
  )

  if (isStream && isEdit) {
    return (
      <Draggable key={id} draggableId={`${id}`} index={id}>
        {(provided, snapshot) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {treeItem}
            </div>
            {snapshot.isDragging && treeItem}
            {/* this is needed to keep stream on the tree */}
          </>
        )}
      </Draggable>
    )
  }
  return treeItem
}

export default memo(TreeRenderer)
