import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  children: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing(3, 3, 8, 3),
  },
  title: {
    color: palette.grey[700],
  },
  logo: {
    width: 200,
  },
  paper: {
    marginTop: spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: spacing(1),
    backgroundColor: palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: spacing(1),
  },
  submit: {
    '&&': {
      margin: spacing(3, 0, 2),
    },
  },
  column: {
    flexDirection: 'column',
  },
  link: {
    color: palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  description: {
    textAlign: 'center',
    marginTop: spacing(2),
    color: palette.grey[500],
  },
}))
