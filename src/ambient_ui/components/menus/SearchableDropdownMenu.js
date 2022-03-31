/*
 * author: rodaan@ambient.ai
 * Dropdown Menu
 * TODO: Make it look more like the Figma design
 */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import Popover from '@material-ui/core/Popover'
// Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
// src
import CheckedInStatusChip from 'components/CheckedInStatusChip'

import '../design_system/Theme.css'
import SearchInput from '../SearchBar'

const useStyles = makeStyles(({ spacing, palette }) => ({
  primary: {
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    borderRadius: '4px',
    padding: '12px',
  },
  searchStatus: {
    padding: '5px',
    fontSize: '10px',
  },
  globalDivider: {
    height: '2px',
    backgroundColor: palette.grey[500],
  },
  listInner: {
    maxHeight: '250px',
    overflowY: 'auto',
  },
  icon_m_left: {
    color: 'white',
    marginLeft: '5px',
  },
  icon_m_right: {
    color: 'white',
    marginRight: spacing(1.25),
  },
  paper: {
    overflowY: 'auto',
    bottom: ({ reverse, reverseOffset }) =>
      reverse ? `${reverseOffset}px` : 'unset',
    top: ({ reverse }) => (reverse ? 'auto !important' : 'unset'),
  },
}))

const SearchableDropdownMenu = props => {
  const { name, reverse, menuItems, globalItem, darkMode } = props

  const [reverseOffset, setReverseOffset] = useState(null)

  const classes = useStyles({ reverse, reverseOffset })

  // State variables
  const [menuItemsShowing, setMenuItemsShowing] = useState(props.menuItems)
  const [anchorEl, setAnchorEl] = useState(null)
  const handleSearch = text => {
    // TODO: Fix with actual search logic
    window.dispatchEvent(new CustomEvent('resize'))

    setMenuItemsShowing(
      menuItems.filter(
        item =>
          !text ||
          (item.primary &&
            item.primary.toLowerCase().includes(text.toLowerCase())) ||
          (item.secondary &&
            item.secondary.toLowerCase().includes(text.toLowerCase())),
      ),
    )
  }

  const handleItemClick = item => {
    if (props.onItemClick) {
      setAnchorEl(null)
      props.onItemClick(item)
    }
  }

  const handleGlobalItemClick = () => {
    if (props.onGlobalItemClick) {
      setAnchorEl(null)
      props.onGlobalItemClick(globalItem)
    }
  }

  // MainIcon goes on the left (optionally)
  // TODO: Add checks
  const MainIconResolved = props.icon
  const MainIcon = (
    <MainIconResolved className={classes.icon_m_right} stroke='white' />
  )

  const GlobalItemIconResolved = globalItem ? globalItem.icon : null
  const GlobalItemIcon = GlobalItemIconResolved ? (
    <GlobalItemIconResolved />
  ) : null
  // ExpandIcon goes on the right
  const ExpandIcon = reverse ? (
    <ExpandLessIcon className={classes.icon_m_left} />
  ) : (
    <ExpandMoreIcon className={classes.icon_m_left} />
  )

  const ListItemsInner = menuItemsShowing.map((item, i) => {
    return (
      <div key={item.value}>
        <ListItem
          onClick={() => handleItemClick(item)}
          button
          divider={i < menuItemsShowing.length - 1}
        >
          <ListItemAvatar>
            <Avatar src={item.img}>{!item.img && item.primary[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.primary} secondary={item.secondary} />
          <CheckedInStatusChip
            isSignedIn={item.isSignedIn}
            contactResource={item.contactResource}
          />
        </ListItem>
      </div>
    )
  })

  const ListToShow = (
    <div>
      {globalItem && (
        <List dense>
          <ListItem onClick={handleGlobalItemClick} button>
            <ListItemAvatar>
              <Avatar>{GlobalItemIcon}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={globalItem.primary}
              secondary={globalItem.secondary}
            />
          </ListItem>
          <Divider light={false} className={classes.globalDivider} />
        </List>
      )}
      <List dense className={classes.listInner}>
        {ListItemsInner.length > 0 ? (
          ListItemsInner
        ) : (
          <ListItem>No data to show</ListItem>
        )}
      </List>
    </div>
  )

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <Button
        aria-describedby={id}
        onClick={e => {
          setAnchorEl(e.currentTarget)
          setMenuItemsShowing(menuItems)
          if (reverse) {
            const elemRect = e.currentTarget.getBoundingClientRect()
            const bottomOffset = window.innerHeight - elemRect.top
            setReverseOffset(bottomOffset)
          }
        }}
        className={classes.primary}
        style={props.customStyle}
      >
        {MainIcon}
        <span>{name}</span>
        {ExpandIcon}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={e => setAnchorEl(null)}
        anchorOrigin={{
          vertical: reverse ? 'top' : 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: reverse ? 'bottom' : 'top',
          horizontal: 'left',
        }}
        classes={{ paper: classes.paper }}
      >
        {ListToShow}
        <div className={classes.searchStatus}>
          Showing {menuItemsShowing.length} of {menuItems.length}
        </div>
        <SearchInput onChange={handleSearch} />
      </Popover>
    </div>
  )
}

SearchableDropdownMenu.defaultProps = {
  menuItems: [{ value: 'default', label: 'default' }],
}

SearchableDropdownMenu.propTypes = {
  darkMode: PropTypes.bool,
  customStyle: PropTypes.object,
  globalItem: PropTypes.object,
  icon: PropTypes.object,
  menuItems: PropTypes.array,
  name: PropTypes.string,
  onGlobalItemClick: PropTypes.func,
  onItemClick: PropTypes.func,
  reverse: PropTypes.bool,
}

export default SearchableDropdownMenu
