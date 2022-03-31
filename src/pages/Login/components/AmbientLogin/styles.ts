import { makeStyles } from '@material-ui/core/styles'

interface StyleProps {
  isMobile: boolean
}

export default makeStyles(theme => ({
  loginForm: {
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
  loginButtons: {
    '&&': {
      margin: theme.spacing(2, 0, 2),
    },
  },
  loginButton: {
    justifyContent: 'center',
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))
