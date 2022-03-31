import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  head: {
    fontSize: 14,
  },
  labelRoot: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    '&:focus': {
      color: darkMode ? palette.common.white : palette.common.black,
    },
    '&:hover': {
      color: darkMode ? palette.common.white : palette.common.black,
    },
  }),
  labelActive: ({ darkMode }) => ({
    color: `${
      darkMode ? palette.common.white : palette.common.black
    } !important`,
  }),
  labelIcon: ({ darkMode }) => ({
    color: darkMode ? `rgba(255,255,255,.56) !important` : palette.common.black,
  }),
}))
