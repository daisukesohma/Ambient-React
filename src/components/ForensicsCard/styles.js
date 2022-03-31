import { makeStyles } from '@material-ui/core/styles'

const SNAPSHOT_WIDTH = 192

export default makeStyles(({ spacing, palette }) => ({
  icon: {
    marginRight: spacing(0.5),
  },
  name: {
    marginBottom: spacing(0.5),
    '&:hover': {
      color: palette.primary.main,
    },
  },
  snapshotContainer: {
    height: (SNAPSHOT_WIDTH * 3) / 4,
    display: 'flex',
  },
  snapshot: {
    width: '100%',
  },
  subtitle: {
    color: palette.grey[500],
    marginBottom: spacing(1),
    '&:hover': {
      color: palette.primary.main,
    },
  },
  time: {
    color: palette.grey[500],
    marginTop: spacing(1),
  },
  baseProgressLine: {
    zIndex: 10,
    height: 4,
    width: '100%',
    background: palette.grey[700],
  },
  heading: ({ showTitles }) => ({
    display: 'flex',
    justifyContent: showTitles ? 'space-between' : 'flex-end',
    marginBottom: showTitles ? 0 : spacing(1),
  }),
}))
