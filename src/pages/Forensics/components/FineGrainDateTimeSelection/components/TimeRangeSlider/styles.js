import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    marginLeft: spacing(4),
    background: 'transparent',
  },
  topLabelContainer: {
    width: '100%',
    marginBottom: spacing(1),
  },
  zoomButton: {
    padding: spacing(0.5),
    borderRadius: spacing(0.5),
    border: `1px solid ${palette.border.default}`,
    marginRight: spacing(0.5),
    userSelect: 'none',
    minWidth: 10,
    lineHeight: '10px',
    fontSize: 10,
    textTransform: 'uppercase',
  },
}))
