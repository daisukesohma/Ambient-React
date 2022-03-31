import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
