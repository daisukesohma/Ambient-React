import React, { useState, MouseEvent } from 'react'
import { useTheme } from '@material-ui/core/styles'
import {
  IconButton,
  Popover,
  MenuList,
  ListItem,
  Typography,
} from '@material-ui/core'
import { map } from 'lodash'
import { MoreVert as MoreVertIcon } from '@material-ui/icons'

import useStyles from './styles'

interface Props {
  onResolveAlert: () => void
}

export default function AlertsMenu({ onResolveAlert }: Props): JSX.Element {
  const classes = useStyles()
  const { palette } = useTheme()

  const alertsMenuItems = [
    { label: 'Add to Spotlight', action: () => {} },
    { label: 'Add to case', action: () => {} },
    { label: 'Share', action: () => {} },
    { label: 'Mark as resolved', action: onResolveAlert },
    { label: 'Conduct Re-ID search', action: () => {} },
  ]

  const [anchorEl, setAnchorEL] = useState<Element | null>(null)

  const onOpenMenu = (event: MouseEvent) => setAnchorEL(event.currentTarget)
  const onCloseMenu = () => setAnchorEL(null)

  return (
    <>
      <IconButton size='small' onClick={onOpenMenu}>
        <MoreVertIcon htmlColor={palette.text.primary} fontSize='small' />
      </IconButton>
      <Popover
        id='alert-menu'
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 45,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuList>
          {map(alertsMenuItems, (alertMenuItem, index) => (
            <ListItem
              button
              key={index}
              onClick={() => alertMenuItem.action()}
              classes={{ root: classes.listItemRoot }}
            >
              <Typography>{alertMenuItem.label}</Typography>
            </ListItem>
          ))}
        </MenuList>
      </Popover>
    </>
  )
}
