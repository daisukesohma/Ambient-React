import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  chips: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(1),
  },
  chip: {
    maxWidth: '50%',
    display: 'flex',
    '& + div': {
      marginLeft: '5px',
    },
  },
  streamName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}))
