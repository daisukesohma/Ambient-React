import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({spacing, palette}) => ({
  level: {
    // color: theme.palette.grey[700],
  },
  levelContainer: {
    maxWidth: 312,
    minWidth: 312,
    // background: theme.palette.grey[50],
    border: `1px solid ${palette.border.default}`,
    padding: spacing(2),
    margin: spacing(0, 2, 0, 0),
    borderRadius: spacing(0.5),
  },
  levelDroppableArea: {
    maxHeight: 250,
    marginBottom: 16,
    overflowY: 'scroll',
    overflowX: 'hidden',
    // background: 'white',
    borderRadius: 4,
  },
}))
