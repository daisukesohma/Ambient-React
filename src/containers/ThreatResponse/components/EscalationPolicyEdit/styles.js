import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  alertPanel: {
    marginBottom: theme.spacing(3),
  },
  escalationPolicyForSevListing: {
    display: 'flex',
    marginBottom: '4px',
  },
  escalationPolicyForSevAlertLabel: {
    marginTop: '2px',
  },
}))

export default useStyles
