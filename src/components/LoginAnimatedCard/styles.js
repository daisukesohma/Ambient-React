import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  base: ({ isMobileOnly }) => ({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: isMobileOnly ? '100%' : 'initial',
  }),
  root: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 4,
    border: `1px solid ${palette.primary[100]}`,
    width: 'fit-content',
  },
  children: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(3),
  },
  logoContainer: {
    background: `linear-gradient(135deg, ${palette.primary[300]}, ${
      palette.secondary[100]
    }, ${palette.common.tertiary})`,
    padding: spacing(6, 12),
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
  title: {
    color: palette.grey[700],
  },
  link: {
    color: palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))
