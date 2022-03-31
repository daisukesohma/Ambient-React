import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    justifyContent: 'space-around',
    paddingTop: theme.spacing(1),
  },
  gridRoot: {
    padding: 'revert',
    justifyContent: 'center',
  },
  gridListTile: {
    height: '100% !important',
    padding: '0px !important',
    '&:hover': {
      boxShadow: 'rgba(253, 35, 92, 0.5) 0px 0px 15px 0px',
    },
  },
}))
