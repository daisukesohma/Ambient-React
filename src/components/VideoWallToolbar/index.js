import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icons, OptionMenu } from 'ambient_ui'
import { useTheme } from '@material-ui/core/styles'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeView from '@material-ui/lab/TreeView'
import { useParams, useHistory } from 'react-router-dom'
import get from 'lodash/get'
import filter from 'lodash/filter'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Droppable } from 'react-beautiful-dnd'
import clsx from 'clsx'
import { toggleToolbarOpenStatus } from 'redux/slices/settings'

import Modal from '../Modal'
import videoWallsTreeSelector from '../../selectors/videoWalls/videoWallsTree'
import streamsAsTree from '../../selectors/sites/streamsAsTree'
import ToolbarSearch from '../ToolbarSearch'
import useEdit from '../../containers/VideoWalls/hooks/useEdit'
import ConfirmDialog from 'components/ConfirmDialog'
import { Can } from 'rbac'

import {
  videoWallDestroyCancelled,
  videoWallDestroyConfirmed,
  setSearch,
  folderCreateRequested,
  folderDestroyConfirmed,
  folderDestroyCancelled,
  videoWallsFetchRequested,
  foldersFetchRequested,
} from './videoWallToolbarSlice'
import VideoWallListItem from './VideoWallListItem'
import useStyles from './styles'
import TreeRenderer from './TreeRenderer'
import VideoWallCreateForm from './VideoWallCreateForm'

const propTypes = {
  onVideoWallSelect: PropTypes.func,
  // activeVideoWall: PropTypes.object.isRequired,
  activeVideoWall: PropTypes.object,
  enableManage: PropTypes.bool,
  showFooter: PropTypes.bool,
  showStreams: PropTypes.bool,
  addToPlayer: PropTypes.bool,
  defaultOpened: PropTypes.array,
}

const defaultProps = {
  onVideoWallSelect: () => {},
  showFooter: true,
  enableManage: true,
  showStreams: true,
  addToPlayer: false,
  defaultOpened: ['VideoWalls'],
}

function VideoWallToolbar({
  activeVideoWall,
  enableManage,
  onVideoWallSelect,
  showFooter,
  showStreams,
  defaultOpened,
  addToPlayer,
}) {
  const { palette } = useTheme()
  const videoWallsTree = useSelector(
    videoWallsTreeSelector({ activeVideoWall }),
  )
  const currentUserId = useSelector(state => state.auth.user.id)
  const streams = useSelector(streamsAsTree)
  const darkMode = useSelector(state => state.settings.darkMode)
  const toolbarOpened = useSelector(state => state.settings.toolbarOpened)
  const folderDeleteRequestId = useSelector(
    state => state.videoWallToolbar.folderDeleteRequestId,
  )
  const folderDeleteLoading = useSelector(
    state => state.videoWallToolbar.folderDeleteLoading,
  )
  const deleteRequestedVideoWall = useSelector(
    state => state.videoWallToolbar.deleteRequestedVideoWall,
  )
  const videoWallDeleteLoading = useSelector(
    state => state.videoWallToolbar.deleteLoading,
  )
  const search = useSelector(state => state.videoWallToolbar.search)

  const dispatch = useDispatch()
  const [createModal, setCreateModal] = useState(false)
  const [foldersExpanded, setFoldersExpanded] = useState(defaultOpened)
  const [streamsExpanded, setStreamsExpanded] = useState([])
  const [openActiveVideoWall, setOpenActiveVideoWall] = useState(true)

  const classes = useStyles({ toolbarOpened, darkMode, showFooter })
  const isEdit = useEdit()
  const { account } = useParams()
  const history = useHistory()

  const sites = {
    // initiate tree structure data
    isRoot: true,
    id: 'Sites',
    name: 'Streams By Sites',
    icon: 'Sites',
    isStream: false, // for adding draggable or not
    children: streams,
  }

  useEffect(() => {
    // VideoWallToolbar
    dispatch(videoWallsFetchRequested({ account }))
    dispatch(foldersFetchRequested({ account }))
  }, [account, dispatch])

  const handleCreateVideoWall = () => {
    setCreateModal(true)
  }

  const handleCreateFolder = () => {
    dispatch(folderCreateRequested({ accountSlug: account }))
    setFoldersExpanded([...foldersExpanded, 'Folders'])
  }

  const ExpandLessIcon = (
    <ExpandLess
      classes={{
        root: classes['treeItem__expand-icon'],
      }}
    />
  )
  const ExpandMoreIcon = (
    <ExpandMore
      classes={{
        root: classes['treeItem__expand-icon'],
      }}
    />
  )

  const toggleActiveVideoWall = () => {
    setOpenActiveVideoWall(!toolbarOpened ? true : !openActiveVideoWall)
    toggleToolbar()
  }

  const toggleToolbar = () => {
    if (!toolbarOpened) dispatch(toggleToolbarOpenStatus())
  }

  const toggleFolderExpanded = id => {
    if (foldersExpanded.indexOf(id) > -1) {
      // remove
      setFoldersExpanded(filter(foldersExpanded, folder => folder !== id))
    } else {
      setFoldersExpanded([...foldersExpanded, id])
    }
  }

  const handleStreamClick = streamId => {
    history.push(`/accounts/${account}/video-walls/streams/${streamId}`)
  }

  return (
    <Drawer
      variant='permanent'
      classes={{
        paper: darkMode ? classes.paperDrawerDark : classes.paperDrawer,
      }}
      className={clsx(classes.wrapper, {
        [classes.drawerOpen]: toolbarOpened,
        [classes.drawerClose]: !toolbarOpened,
      })}
      open={toolbarOpened}
    >
      <ConfirmDialog
        open={!!folderDeleteRequestId}
        onClose={() => {
          dispatch(folderDestroyCancelled())
        }}
        onConfirm={() => {
          dispatch(
            folderDestroyConfirmed({
              folderId: folderDeleteRequestId,
            }),
          )
        }}
        loading={folderDeleteLoading}
        content='Are you sure you want to delete this folder? This cannot be undone.'
      />

      <ConfirmDialog
        open={!!deleteRequestedVideoWall}
        onClose={() => {
          dispatch(videoWallDestroyCancelled())
        }}
        onConfirm={() => {
          dispatch(
            videoWallDestroyConfirmed({
              videoWall: deleteRequestedVideoWall,
            }),
          )
        }}
        loading={videoWallDeleteLoading}
        content='Are you sure you want to delete this video wall? This cannot be undone.'
      />

      {enableManage && (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          className={classes.titleWrapper}
        >
          {toolbarOpened && <span>Video Walls</span>}
          <Can I='create' on='VideoWalls'>
            <OptionMenu
              darkMode={darkMode}
              icon={<Button className={classes.titleWrapper__btn}>+</Button>}
              menuItems={[
                {
                  label: 'Create Video Wall',
                  value: 'createVideoWall',
                  onClick: handleCreateVideoWall,
                },
                {
                  label: 'New Folder',
                  value: 'newFolder',
                  onClick: handleCreateFolder,
                },
              ]}
              paperClass={classes.paperClassOverride}
              textClass='am-subtitle1'
              noBackground
            />
          </Can>
        </Box>
      )}

      {toolbarOpened && <ToolbarSearch search={search} setSearch={setSearch} />}

      <Box className={classes.listWrapper}>
        <List
          disablePadding
          component='nav'
          aria-labelledby='nested-list-subheader'
        >
          {toolbarOpened && (
            <ListItem
              classes={{ root: classes.listItem }}
              onClick={toggleActiveVideoWall}
            >
              <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <PlayCircleOutlineIcon
                  style={{
                    fill: darkMode ? palette.common.white : palette.grey[700],
                  }}
                />
              </ListItemIcon>

              <ListItemText
                classes={{ primary: 'am-subtitle1' }}
                primary='Currently Viewing'
              />
              {activeVideoWall &&
                (openActiveVideoWall ? ExpandLessIcon : ExpandMoreIcon)}
            </ListItem>
          )}
          {toolbarOpened && activeVideoWall && (
            <Collapse in={openActiveVideoWall} timeout='auto' unmountOnExit>
              <List disablePadding>
                <VideoWallListItem
                  videoWall={activeVideoWall}
                  activeVideoWall={activeVideoWall}
                  isPublicVideoWall={
                    get(activeVideoWall, 'owner.user.id') !== currentUserId
                  }
                  focusedRename
                  enableManage={enableManage}
                  onVideoWallSelect={onVideoWallSelect}
                />
              </List>
            </Collapse>
          )}
        </List>

        {!toolbarOpened && (
          <>
            <ListItem
              classes={{ root: classes.listItem }}
              onClick={toggleToolbar}
            >
              <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <Icons.Investigate
                  width={24}
                  height={24}
                  stroke={palette.grey[500]}
                />
              </ListItemIcon>
            </ListItem>
            <ListItem
              classes={{ root: classes.listItem }}
              onClick={toggleToolbar}
            >
              <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <PlayCircleOutlineIcon
                  style={{
                    fill: darkMode ? palette.common.white : palette.grey[700],
                  }}
                />
              </ListItemIcon>
            </ListItem>
            <ListItem
              classes={{ root: classes.listItem }}
              onClick={toggleToolbar}
            >
              <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <Icons.Video
                  stroke={darkMode ? palette.common.white : palette.grey[700]}
                />
              </ListItemIcon>
            </ListItem>
            <ListItem
              classes={{ root: classes.listItem }}
              onClick={toggleToolbar}
            >
              <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <Icons.Sites
                  stroke={darkMode ? palette.common.white : palette.grey[700]}
                />
              </ListItemIcon>
            </ListItem>
          </>
        )}

        {toolbarOpened && (
          <>
            <TreeView
              classes={{ root: classes.treeWrapper }}
              expanded={foldersExpanded}
            >
              <TreeRenderer
                isEdit={isEdit}
                classes={classes}
                nodes={videoWallsTree}
                toolbarOpened={toolbarOpened}
                darkMode={darkMode}
                toggleExpanded={toggleFolderExpanded}
                enableManage={enableManage}
                addToPlayer={addToPlayer}
                foldersExpanded={foldersExpanded}
                onVideoWallSelect={onVideoWallSelect}
              />
            </TreeView>

            {showStreams && (
              <Droppable droppableId='video-wall-toolbar' isDropDisabled>
                {provided => (
                  <div ref={provided.innerRef}>
                    <TreeView
                      classes={{ root: classes.treeWrapper }}
                      expanded={streamsExpanded}
                      onNodeToggle={(event, nodeIds) => {
                        setStreamsExpanded(nodeIds)
                      }}
                      defaultExpandIcon={ExpandMoreIcon}
                      defaultCollapseIcon={ExpandLessIcon}
                    >
                      <TreeRenderer
                        isEdit={isEdit}
                        classes={classes}
                        nodes={sites}
                        toolbarOpened={toolbarOpened}
                        darkMode={darkMode}
                        enableManage={enableManage}
                        addToPlayer={addToPlayer}
                        onVideoWallSelect={onVideoWallSelect}
                        handleStreamClick={handleStreamClick}
                        activeVideoWall={activeVideoWall}
                      />
                    </TreeView>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </>
        )}
      </Box>
      {showFooter && (
        <Box
          display='flex'
          alignItems='center'
          justifyContent={toolbarOpened ? 'flex-end' : 'flex-start'}
          className={classes.modeSelector}
        >
          <IconButton onClick={() => dispatch(toggleToolbarOpenStatus())}>
            {toolbarOpened ? (
              <ChevronLeftIcon
                style={{
                  color: darkMode ? palette.common.white : palette.common.black,
                }}
              />
            ) : (
              <ChevronRightIcon
                style={{
                  color: darkMode ? palette.common.white : palette.common.black,
                }}
              />
            )}
          </IconButton>
        </Box>
      )}
      <Modal
        isChildOpen={createModal}
        handleChildClose={() => setCreateModal(false)}
        customStyle={{ width: '30%' }}
        autoDarkMode
      >
        <VideoWallCreateForm onCreated={() => setCreateModal(false)} />
      </Modal>
    </Drawer>
  )
}

VideoWallToolbar.propTypes = propTypes
VideoWallToolbar.defaultProps = defaultProps

export default VideoWallToolbar
