import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  isMobile: boolean
}

export default makeStyles(theme => ({
  paper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: ({ isMobile }: StyleProps) =>
      isMobile ? theme.spacing(1) : theme.spacing(8),
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  submit: {
    '&&': {
      margin: theme.spacing(3, 0, 2),
    },
  },
}))
