import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  darkMode: boolean
  hoverColor: string | undefined
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  menuItem: {
    padding: spacing(1, 1),
  },
  menuText: ({ darkMode, hoverColor }: StyleProps) => ({
    color: darkMode ? palette.grey[100] : palette.grey[900],
    '&:hover': {
      background: darkMode ? palette.grey[800] : palette.grey[300],
      color: hoverColor || darkMode ? palette.grey[100] : palette.grey[900],
    },
  }),
}))
