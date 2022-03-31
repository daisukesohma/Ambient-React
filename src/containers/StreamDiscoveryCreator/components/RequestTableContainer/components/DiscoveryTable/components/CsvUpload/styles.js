import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: spacing(1),
    width: '100%',
  },
  fileName: {
    background: palette.grey[50],
    border: `1px solid ${palette.primary[200]}`,
    borderRadius: 4,
    color: palette.common.black,
    lineHeight: 2,
    margin: spacing(0, 1, 0, 0),
    padding: spacing(1),
  },
  numberRows: {
    color: palette.grey[700],
  },
}))
