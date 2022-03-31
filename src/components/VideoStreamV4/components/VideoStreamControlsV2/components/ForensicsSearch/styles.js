import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  expandedContainer: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  searchPanel: {
    marginTop: theme.spacing(4),
  },

  searchResultsPanel: {
    marginTop: theme.spacing(1),
    color: theme.palette.grey[500],
  },

  reIdIcon: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  iconButtonRoot: {
    // background: theme.palette.common.black,
    transition: 'background 10ms cubic-bezier(1,0,0,1) 0ms',
    // '&:hover': {
    //   background: theme.palette.grey[800],
    // },
  },
}))
