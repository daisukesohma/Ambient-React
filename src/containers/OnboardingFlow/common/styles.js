import { createMuiTheme, makeStyles } from '@material-ui/core/styles'

export const THEME = createMuiTheme({
  palette: {
    primary: {
      main: '#1881FF',
      contrastText: '#fff',
    },
  },
})

export const useStyles = makeStyles(theme => ({
  button: {
    width: 160,
    height: 36,
    borderRadius: 20,
    fontWeight: 400,
    fontSize: 14,
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  fab: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
  },
  textFieldSize: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: '18.5px 14px',
    minWidth: 125,
    width: '100%',
  },
  textFieldSm: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 125,
  },
}))

export const tableStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}))

export const containerStyle = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '30px auto',
    padding: 30,
  },
  formContainer: {
    maxWidth: 441, // 568 is on AirBnb,
    minWidth: 441,
    padding: 32,
    paddingBottom: 24,
  },
  formWideContainer: {
    maxWidth: 568, // 568 is on AirBnb,
    minWidth: 568,
    padding: 32,
    paddingBottom: 24,
  },
  tableContainer: {
    width: '100%',
  },
}
