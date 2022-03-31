import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  modal: ({ darkMode }) => ({
    // background: darkMode ? theme.palette.grey[900] : theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[700]}`,
    left: '30%',
    minWidth: 420,
    padding: theme.spacing(3),
    position: 'absolute',
    top: '10%',
    width: '25%',
  }),
  title: ({ darkMode }) => ({
    // color: theme.palette.grey[darkMode ? 400 : 700],
  }),
  inputRoot: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  },
  inputText: ({ darkMode }) => ({
    // color: `${theme.palette.grey[darkMode ? 400 : 700]} !important`,
  }),
}))
