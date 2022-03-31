import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  timeContainer: {
    marginLeft: spacing(3),
  },
  timeLabel: {
    width: 128,
    marginTop: spacing(-1),
  },
  title: {
    width: '100%',
    // color: palette.grey[700],
    marginBottom: 8,
  },
  selector: {
    padding: '0px 4px 6px 6px',
    borderRadius: spacing(0.5),
  },
  selectorText: {
    color: palette.primary[300],
  },
  zIndexCorrection: {
    zIndex: 100,
  },
  timelineBar: {
    flexGrow: 1,
  },
}))
