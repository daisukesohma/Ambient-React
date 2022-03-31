import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  editStreamSiteTopHeaderRoot: ({ darkMode }) => ({
    background: darkMode ? palette.grey[700] : palette.grey[300],
    padding: spacing(2),
    borderRadius: spacing(0.5),
    border: `1px solid ${palette.common.greenPastel}`,
  }),
  header: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[700],
  }),
  body: ({ darkMode }) => ({
    color: darkMode ? palette.grey[400] : palette.grey[600],
    height: 72,
  }),
  emphasis: ({ darkMode }) => ({
    color: darkMode ? palette.common.greenPastel : palette.primary.main,
  }),
  warning: {
    color: palette.warning.main,
  },
}))
