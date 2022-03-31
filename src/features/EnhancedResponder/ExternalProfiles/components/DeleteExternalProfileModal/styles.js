import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    top: '50%',
    left: '50%',
    width: '50%',
    height: 'auto',
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    border: `1px solid ${palette.grey[100]}`,
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    padding: spacing(2, 1, 2),
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto',
  }),
  title: {
    margin: spacing(2),
    textAlign: 'left',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: spacing(2),
    paddingTop: '10px',
  },
  column2: {
    paddingLeft: '10px',
    textAlign: 'center',
  },
  inputRow: ({ darkMode }) => ({
    paddingLeft: '32px',
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
    width: '100%',
    margin: spacing(2),
  }),
  inputContainer: {
    paddingBottom: '8px',
  },
  input: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
    '&:not($disabled):not($focused):not($error):before': {
      borderBottom: `2px solid ${
        darkMode ? palette.common.white : palette.common.black
      } !important`,
    },
  }),
  label: {
    float: 'left',
    paddingRight: '16px',
  },
  error: {
    paddingRight: '10px',
    paddingTop: '10px',
    color: 'red',
  },
  progress: {
    width: '100%',
    textAlign: 'center',
  },
}))
