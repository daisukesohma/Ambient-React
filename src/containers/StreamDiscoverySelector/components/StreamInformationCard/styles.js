import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  streamNumber: ({ darkMode }) => ({
    background: darkMode
      ? theme.palette.common.black
      : theme.palette.common.white,
    position: 'absolute',
    bottom: theme.spacing(4),
  }),
  contentDiv: {
    display: 'flex',
    position: 'relative',
    marginTop: 72,
    backgroundColor: theme.palette.common.black,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  hoveringBtn: {
    position: 'absolute',
    top: '50%',
    left: 'calc(50% - 12px)',
    cursor: 'pointer',
  },
  notSelected: {
    color: theme.palette.grey[500],
    height: 80,
    marginLeft: 24,
    paddingTop: 16,
    boxSizing: 'border-box',
  },
}))
