import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: {
    backgroundColor: palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: spacing(0.5),
    marginBottom: spacing(3),
    padding: spacing(3),
  },
  root: {
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
    },
    '& .MuiFormControlLabel-root': {
      marginLeft: 0,
    },
  },
  flexItem: {
    display: 'flex',
  },
  themeRoot: {
    padding: spacing(2, 3),
  },
  themeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeTitle: {
    marginBottom: spacing(1),
  },
  titleBar: {
    marginBottom: spacing(3),
    marginTop: spacing(3),
  },
}))
