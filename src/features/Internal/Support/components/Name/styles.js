import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ palette }) => ({
  root: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  expired: {
    color: palette.grey[500],
  },
}))
