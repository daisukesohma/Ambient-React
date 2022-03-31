import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  darkMode: boolean
  noBackground: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  paperRoot: {
    marginTop: spacing(1),
    boxShadow: palette.common.shadows.hard,
  },
  iconContainer: ({ darkMode, noBackground }: StyleProps) => ({
    alignItems: 'center',
    background: darkMode && !noBackground ? palette.common.black : 'inherit',
    borderRadius: spacing(0.5),
    color: darkMode ? palette.grey[200] : palette.grey[700],
    cursor: 'pointer',
    display: 'flex',
    height: spacing(2.5),
    justifyContent: 'center',
    mixBlendMode: 'normal',
    width: spacing(4),
  }),
  iconContainerBackground: {
    boxShadow: palette.common.shadows.soft,
  },
  dividerText: ({ darkMode }: StyleProps) => ({
    color: darkMode ? palette.grey[200] : palette.grey[700],
    height: spacing(2),
    cursor: 'default',
  }),
  menuContainer: ({ darkMode }: StyleProps) => ({
    boxShadow: palette.common.shadows.hard,
    background: darkMode ? palette.grey[900] : palette.grey[100],
    cursor: 'pointer',
    border: darkMode ? `1px solid ${palette.grey[700]}` : 'none',
    borderRadius: spacing(0.5),
  }),
  menuItem: {
    padding: spacing(1, 0),
  },
  menuText: ({ darkMode }: StyleProps) => ({
    color: darkMode ? palette.grey[200] : palette.grey[900],
    '&:hover': {
      background: darkMode ? palette.grey[800] : palette.grey[300],
    },
  }),
  paperClassOverride: {
    marginTop: `${spacing(2)} !important`,
  },
}))
