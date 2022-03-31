import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ palette }) => ({
  menuItem: {
    padding: '8px 0',
  },
  menuText: ({ darkMode, hoverColor }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[700],
    '&:hover': {
      color: hoverColor || palette.primary.main,
    },
  }),
}))
