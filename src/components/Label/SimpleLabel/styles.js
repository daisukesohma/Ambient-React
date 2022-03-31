import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  labelType: ({ color }) => ({
    margin: theme.spacing(0, 1),
    padding: theme.spacing(0.25, 1),
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${color || theme.palette.grey[300]}`,
    color: color || theme.palette.grey[500],
  }),
  inlineRoot: ({ toolTipWidth }) => ({
    margin: 0,
    display: 'flex',
    width: toolTipWidth,
  }),
  background: ({ backgroundColor }) => ({
    backgroundColor,
    border: backgroundColor,
  }),
}))
