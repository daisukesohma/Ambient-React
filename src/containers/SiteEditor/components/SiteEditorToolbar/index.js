import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import StreamEditorHelper from './StreamEditorHelper'
import AccessEditorHelper from './AccessEditorHelper'

const SiteEditorToolbar = ({
  accountSlug,
  currentMode,
  modeOptions,
  onModeChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box display='flex' flexDirection='column'>
      <Box p={1}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <Typography variant='h5'>{currentMode}</Typography>
          </Box>
          <Box>
            <IconButton
              onClick={event => {
                setAnchorEl(event.currentTarget)
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id='long-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {modeOptions.map(option => (
                <MenuItem
                  key={option}
                  selected={option === currentMode}
                  onClick={() => {
                    handleMenuClose()
                    if (onModeChange) {
                      onModeChange(option)
                    }
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box p={1}>
        {currentMode === 'Streams' && (
          <StreamEditorHelper accountSlug={accountSlug} />
        )}
        {currentMode === 'Access' && (
          <AccessEditorHelper accountSlug={accountSlug} />
        )}
      </Box>
    </Box>
  )
}

SiteEditorToolbar.propTypes = {
  accountSlug: PropTypes.string,
  currentMode: PropTypes.string,
  modeOptions: PropTypes.array,
  onModeChange: PropTypes.func,
}

export default SiteEditorToolbar
