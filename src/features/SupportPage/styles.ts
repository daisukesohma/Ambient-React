import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  title: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    fontSize: 24,
  }),
  textInfo: {
    marginLeft: spacing(2),
  },
  header: {
    marginBottom: spacing(4),
  },
  flex: {
    display: 'flex',
  },
}))
