import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  title: ({ darkMode }: StyleArguments) => ({
    borderBottom: darkMode ? '1px solid white' : '1px solid black',
    fontSize: 18,
  }),
  container: ({ darkMode }: StyleArguments) => ({
    background: darkMode ? palette.grey[800] : palette.common.white,
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: spacing(0.5),
    marginBottom: spacing(2),
    padding: spacing(1),
    margin: 0,
  }),
  button: {
    padding: spacing(1, 0, 1, 1),
  },
  icon: {
    paddingTop: 2,
    paddingRight: 8,
  },
}))
