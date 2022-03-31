import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  inputBaseInput: {
    borderRadius: spacing(0.5),
    padding: spacing(1.5),
    fontSize: 14,
  },
  link: {
    color: palette.primary.main,
  },
  sectionHeader: {
    color: palette.grey[800],
  },
  subtitleHeader: {
    color: palette.grey[700],
  },
  spacingBottom: {
    marginBottom: spacing(2),
  },
  section: {
    marginBottom: spacing(2),
  },
  error: {
    color: palette.error.main,
  },
}))
