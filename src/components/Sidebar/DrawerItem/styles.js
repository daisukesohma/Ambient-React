import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  DrawerItem: {
    display: 'flex',
    justifyContent: ({ open }) => (open ? 'space-between' : 'center'),
    alignItems: 'center',
    padding: spacing(1),
    paddingLeft: ({ open }) => (open ? spacing(3) : spacing(1)),
    cursor: 'pointer',
    '&:hover': {
      background: palette.grey[800],
    },
  },
  DrawerSubItem: {
    padding: spacing(1),
    paddingLeft: ({ open }) => (open ? spacing(7) : spacing(1)),
    cursor: 'pointer',
    '&:hover': {
      background: palette.grey[800],
    },
  },
  DrawerItemText: {
    '&&': {
      display: ({ open }) => (open ? 'block' : 'none'),
      marginLeft: spacing(2),
      color: palette.common.white,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  DrawerIcon: {
    '&&': {
      color: palette.common.white,
      fontSize: 20,
    },
  },
}))
