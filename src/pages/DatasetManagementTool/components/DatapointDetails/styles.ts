import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  root: {
    overflowX: 'scroll',
    overflowY: 'auto',
    borderLeft: '1px solid grey',
    paddingLeft: spacing(1),
    height: '100%',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    bottom: 12,
    paddingTop: spacing(1),
  },
  details: {
    display: 'block',
  },
  detail: {
    display: 'flex',
    wordBreak: 'break-all',
  },
  detailHeader: {
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
    display: 'flex',
    paddingRight: spacing(1),
    wordBreak: 'keep-all',
  },
}))
