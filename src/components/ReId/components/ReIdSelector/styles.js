import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode, isMini }) => ({
    boxSizing: 'border-box',
    color: darkMode ? palette.common.white : palette.common.black,
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: spacing(0.5),
    width: '100%',
    minHeight: isMini ? 'unset' : 180,
    height: 'fit-content',
    margin: isMini ? spacing(3, 0, 0, 0) : spacing(3, 0),
    padding: isMini ? spacing(0, 2.25, 0, 0) : spacing(1, 1, 2, 1),
    position: 'relative',
  }),
  vectorRow: ({ isMini }) => ({
    marginTop: isMini ? spacing(0) : spacing(2),
    // marginBottom: isMini ? theme.spacing(1.5) : theme.spacing(2),
    paddingBottom: isMini ? spacing(0.75) : spacing(2),
    width: isMini ? 300 : '100%',
    overflowY: 'scroll',
  }),
  personSearchTitle: {
    color: palette.grey[500],
    marginRight: spacing(2),
  },
  timeSearched: {
    color: palette.grey[400],
  },
  emptyContent: {
    color: palette.grey[500],
    height: '100%',
    width: '100%',
    marginTop: spacing(3),
  },
  close: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
  },
  snapshotContainer: {
    marginRight: spacing(1),
  },
}))
