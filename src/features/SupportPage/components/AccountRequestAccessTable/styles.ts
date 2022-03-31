import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    paddingTop: spacing(4),
  }),
}))
