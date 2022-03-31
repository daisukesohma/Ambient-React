import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import onClickOutside from 'react-onclickoutside'

import PlayheadPosition from '../PlayheadPosition'
import DarkModeButton from '../DarkModeButton'
import PositionButton from '../PositionButton'

const useStyles = makeStyles(({ palette }) => ({
  root: ({ isFullScreenVideo }) => ({
    width: 310,
    height: isFullScreenVideo ? 50 : 140,
    backgroundColor: palette.common.black,
    zIndex: 6,
    borderRadius: 3,
    color: palette.common.white,
    opacity: 0.75,
  }),
}))

const SettingsMenu = ({
  darkMode,
  isFollowing,
  isFullScreenVideo,
  isPlayheadInRange,
  playheadFixedPosition,
  setIsSettingsVisible,
  setPlayheadFixedPosition,
  timelineSettingPosition,
  toggleDarkMode,
  toggleTimelinePosition,
}) => {
  SettingsMenu.handleClickOutside = () => closeSettingsMenu()
  const classes = useStyles({ isFullScreenVideo })
  const closeSettingsMenu = () => setIsSettingsVisible(false)

  return (
    <div style={{ zIndex: 6 }}>
      <List className={classes.root}>
        {!isFullScreenVideo && (
          <ListItem>
            <ListItemText
              className={classes.listItemText}
              inset
              primary='Timeline position'
            />
            <ListItemSecondaryAction>
              <span
                onClick={() => {
                  toggleTimelinePosition()
                  closeSettingsMenu()
                }}
              >
                <PositionButton position={timelineSettingPosition} />
              </span>
            </ListItemSecondaryAction>
          </ListItem>
        )}
        <ListItem>
          <ListItemText
            className={classes.listItemText}
            inset
            primary='Playhead position'
          />
          <ListItemSecondaryAction>
            <PlayheadPosition
              isLocked={isFollowing}
              isPlayheadInRange={isPlayheadInRange}
              playheadFixedPosition={playheadFixedPosition}
              setPlayheadFixedPosition={setPlayheadFixedPosition}
              cb={() => {
                closeSettingsMenu()
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        {!isFullScreenVideo && (
          <ListItem>
            <ListItemIcon>
              <DarkModeButton darkMode />
            </ListItemIcon>
            <ListItemText primary={`Dark mode: ${darkMode ? 'On' : 'Off'}`} />
            <ListItemSecondaryAction>
              <Switch
                edge='end'
                onChange={() => {
                  toggleDarkMode()
                  closeSettingsMenu()
                }}
                checked={darkMode}
                color='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </div>
  )
}
const clickOutsideConfig = {
  handleClickOutside: () => SettingsMenu.handleClickOutside,
}

// Add prototype so wrapped component is recognized as React Component and  no error
// https://github.com/Pomax/react-onclickoutside/issues/327
SettingsMenu.prototype = {}

SettingsMenu.defaultProps = {
  darkMode: false,
  isFollowing: true,
  isFullScreenVideo: false,
  isPlayheadInRange: true,
  playheadFixedPosition: 'right',
  setIsSettingsVisible: () => {},
  setPlayheadFixedPosition: () => {},
  timelineSettingPosition: 'below',
  toggleDarkMode: () => {},
  toggleTimelinePosition: () => {},
}

SettingsMenu.propTypes = {
  darkMode: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isFullScreenVideo: PropTypes.bool,
  isPlayheadInRange: PropTypes.bool,
  playheadFixedPosition: PropTypes.string,
  setIsSettingsVisible: PropTypes.func,
  setPlayheadFixedPosition: PropTypes.func,
  timelineSettingPosition: PropTypes.oneOf(['below', 'overlay']),
  toggleDarkMode: PropTypes.func,
  toggleTimelinePosition: PropTypes.func,
}

export default onClickOutside(SettingsMenu, clickOutsideConfig)
