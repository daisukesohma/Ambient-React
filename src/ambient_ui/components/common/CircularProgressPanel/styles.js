import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    height: '100%',
    width: '100%',
    padding: spacing(2),
    background: darkMode ? palette.common.black : palette.common.white,
    border: darkMode ? `1px solid ${palette.grey[700]}` : null,
  }),
  progress: {
    margin: spacing(2),
  },
  title: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 100 : 700],
  }),
}))
