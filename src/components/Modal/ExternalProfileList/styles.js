import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  ExternalProfileList: {
    '&&': {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  caption: {
    color: theme.palette.grey[500],
    textAlign: 'center',
  },
  time: {
    margin: theme.spacing(0, 0.5),
  },
}))
