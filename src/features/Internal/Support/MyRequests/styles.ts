import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  filterTitle: {
    marginRight: spacing(1),
    marginTop: spacing(1),
    fontSize: spacing(1.75),
  },
  filterDropdown: {
    marginRight: spacing(1),
  },
  additionalTools: {
    display: 'flex',
  },
}))
