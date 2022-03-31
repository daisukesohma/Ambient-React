import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    borderBottom: `2px solid ${palette.grey[darkMode ? 700 : 300]}`,
  }),

  panelRoot: {
    boxShadow: 'none',
  },

  panelSummaryRoot: ({ hovered, darkMode }) => {
    if (darkMode) {
      return {
        padding: 0,
        backgroundColor: hovered
          ? hexRgba(palette.grey[900], 0.95)
          : palette.grey[900],
      }
    }
    return {
      padding: 0,
      backgroundColor: hovered ? palette.primary[50] : palette.grey[100],
    }
  },

  panelSummaryContent: {
    margin: `${spacing(1)}px 0px !important`,
  },

  panelDetailsRoot: {
    padding: 0,
  },
}))
