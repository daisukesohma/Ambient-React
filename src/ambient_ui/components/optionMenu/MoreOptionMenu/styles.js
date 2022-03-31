/* eslint-disable no-nested-ternary */
import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  iconContainer: ({ darkMode, lightIcon }) => ({
    marginTop: -4,
    color:
      darkMode && lightIcon
        ? palette.grey[700]
        : darkMode
        ? palette.common.white
        : palette.grey[700],

    '&:hover': {
      color: palette.primary.main,
    },
  }),
}))
