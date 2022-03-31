import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  redColor: {
    color: palette.error.main,
  },
  blackColor: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  grayColor: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 100 : 700],
  }),
  blueColor: {
    color: palette.primary.main,
  },
  root: {
    cursor: 'pointer',
  },
}))
