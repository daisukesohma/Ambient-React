import { makeStyles } from '@material-ui/core/styles'

import { shadows } from '../../shared/styles'

export const useStyles = makeStyles(({ spacing, palette }) => ({
  paperRoot: {
    marginTop: spacing(1),
    boxShadow: shadows.hard,
  },
  iconContainer: ({ darkMode, noBackground }) => ({
    alignItems: 'center',
    background: darkMode && !noBackground ? palette.common.black : null,
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
    boxShadow: shadows.soft,
    '&:hover': {
      boxShadow: shadows.hard,
    },
  },
  dividerText: ({ darkMode }) => ({
    color: darkMode ? palette.grey[200] : palette.grey[700],
    height: spacing(2),
    cursor: 'default',
  }),
  menuContainer: ({ darkMode }) => ({
    boxShadow: shadows.hard,
    background: darkMode ? palette.grey[800] : palette.grey[100],
    cursor: 'pointer',
    padding: spacing(0.25, 1, 0.5, 1),
    border: darkMode ? `1px solid ${palette.grey[700]}` : null,
    borderRadius: spacing(0.5),
  }),
  menuItem: {
    padding: spacing(1, 0),
  },
  menuText: ({ darkMode }) => ({
    color: darkMode ? palette.grey[200] : palette.grey[700],
    '&:hover': {
      color: palette.primary.main,
    },
  }),
  paperClassOverride: {
    marginTop: `${spacing(2)} !important`,
  },
}))
