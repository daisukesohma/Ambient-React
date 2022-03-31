import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    top: '50%',
    left: '50%',
    width: '60%',
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
  input: ({ darkMode }) => ({
    paddingTop: '6px',
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
  }),
  siteDropDown: {
    paddingLeft: '122px',
    paddingTop: '10px',
    width: '350px',
  },
  threatSignatureDropDown: {
    paddingTop: '10px',
    width: '227px',
  },
  tree: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    maxHeight: 400,
    overflowY: 'auto',
    width: '100%',
    padding: '8px 0px 8px 25px',
  }),
  error: {
    paddingRight: '10px',
    paddingTop: '10px',
    color: 'red',
  },
  progress: {
    width: '100%',
    textAlign: 'center',
  },
  accordian: {
    width: '100%',
  },
  accordianDetails: {
    width: '100%',
  },
  checkIcon: {
    paddingLeft: '10px',
  },
  textFieldGrid: ({ darkMode }) => ({
    paddingTop: '6px',
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
    width: '100%',
  }),
  textField: ({ darkMode }) => ({
    width: '100%',
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
  }),
  textFieldInput: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
