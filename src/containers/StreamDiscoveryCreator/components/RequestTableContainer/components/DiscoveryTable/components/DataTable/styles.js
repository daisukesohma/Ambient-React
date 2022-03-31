import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  table: {
    borderSpacing: 0,
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: spacing(0.5),
    padding: spacing(2),
    paddingTop: spacing(8),
  },
  tableContainer: {
    minHeight: 'calc(100vh - 400px)',
  },
  tBody: {
    verticalAlign: 'top',
  },
  tHeader: {
    padding: spacing(2),
  },
  tRow: {
    verticalAlign: 'top',
    height: spacing(7),
    '&:hover': {
      background: palette.grey[700],
    },
  },
  tCell: {
    height: spacing(7),
  },
  addRowContainer: {
    position: 'absolute',
    top: 17,
    right: spacing(3),
  },
  fabRoot: {
    borderRadius: '50% !important',
    background: `${palette.primary.main} !important`,
    '&:hover': {
      background: `${palette.common.tertiary} !important`,
    },
  },
  pagination: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
}))
