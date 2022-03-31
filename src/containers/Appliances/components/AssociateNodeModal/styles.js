import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    top: '50%',
    left: '50%',
    width: '30%',
    height: 'auto',
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    border: `1px solid ${palette.greenPastel}`,
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
    marginTop: spacing(1),
    marginBottom: spacing(5),
    textAlign: 'center',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: spacing(2),
    marginTop: spacing(3),
  },
  inputRow: {
    paddingRight: spacing(4),
  },
  rows: ({ darkMode }) => ({
    paddingLeft: spacing(4),
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
    display: 'flex',
    flexDirection: 'column',
  }),
  input: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
    borderColor: darkMode ? palette.common.white : palette.common.black,
    '&:not($disabled):not($focused):not($error):before': {
      borderBottom: `2px solid ${
        darkMode ? palette.common.white : palette.common.black
      } !important`,
    },
    width: '50%',
    marginBottom: spacing(1),
  }),
  fields: {
    paddingLeft: spacing(1),
  },
  label: {
    float: 'left',
    paddingTop: spacing(0.5),
    paddingRight: spacing(2),
  },
}))
