import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(({ palette }) => ({
  title: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
