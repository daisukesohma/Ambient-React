import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    width: '100%',
    margin: 0,
  },

  divider: {
    width: '100%',
  },

  decoratedText: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),

  buttons: {
    margin: spacing(0, 0.5),
  },
}))
