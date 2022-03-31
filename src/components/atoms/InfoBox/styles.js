import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  alertPanel: {
    padding: spacing(0, 1),
    '& .MuiAlert-icon': {
      marginTop: 2,
    },
    // '& .MuiAlertTitle-root': {
    //   margin: 0,
    // },
  },
  alertTitle: {
    margin: 0,
  },
}))
