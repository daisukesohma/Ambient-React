import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  contentWrapper: {
    flex: 1,
    overflowY: 'auto',
    flexWrap: 'nowrap',
  },
  alertContainer: {
    flex: 1,
  },
  gridList: {
    flexWrap: 'wrap',
    height: '100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  tileRoot: {
    padding: '12px !important',
  },
  tileTile: {
    height: '100%',
    overflow: 'initial',
  },
  title: {
    color: theme.palette.primary.light,
  },
}))
