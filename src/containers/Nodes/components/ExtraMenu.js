import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'

// Mock options prop, which will be passed in
//
// const options = [{
//   name: 'Go',
//   action: () => console.log('go')
// }, {
//   name: 'uh huh',
//   action: () => console.log('yup')
// }]

// Adapted from: https://bit.dev/mui-org/material-ui/menu?example=5c84d91b98f9d200131d36c6
//
const ITEM_HEIGHT = 48
function ExtraMenu(props) {
  const { options } = props
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        aria-label="More"
        aria-owns={open ? 'long-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
          },
        }}
      >
        {options.map(option => (
          <MenuItem key={option.name} onClick={option.action}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

ExtraMenu.defaultProps = {
  options: [],
}

ExtraMenu.propTypes = {
  options: PropTypes.array,
}

export default ExtraMenu
