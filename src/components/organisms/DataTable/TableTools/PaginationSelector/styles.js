import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  controllerText: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 100 : 700],
    marginRight: spacing(1),
  }),
  paginationOptions: {
    marginRight: spacing(1),
  },
}))
