import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  noAccessText: ({ darkMode }: StyleArguments) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: spacing(3),
    marginBottom: spacing(5),
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  container: {
    justifyContent: 'center',
    height: '100%',
  },
  form: {
    marginTop: spacing(5),
  },
}))
