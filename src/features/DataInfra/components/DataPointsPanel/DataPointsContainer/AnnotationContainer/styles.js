import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  dialogTitleRoot: ({ darkMode }) => ({
    borderBottom: darkMode ? `1px solid ${palette.grey[800]}` : null,
  }),
  dialogContentRoot: {
    padding: spacing(1, 3, 0.5),
  },
  dialogActionsRoot: {
    padding: spacing(3),
  },
}))
