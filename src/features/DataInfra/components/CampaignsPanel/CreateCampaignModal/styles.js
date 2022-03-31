import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    top: '50%',
    left: '50%',
    width: '30%',
    height: 'auto',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    backgroundColor: ({ darkMode }) =>
      darkMode ? palette.common.black : palette.common.white,
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
  },
  title: {
    margin: spacing(2),
    textAlign: 'left',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: spacing(2),
  },
  inputRow: {
    paddingRight: '32px',
  },
  rows: {
    paddingLeft: '32px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: ({ darkMode }) => ({
    '&:not($disabled):not($focused):not($error):before': {
      borderBottom: `2px solid ${
        darkMode ? palette.common.white : palette.common.black
      } !important`,
    },
    width: '75%',
  }),
  fields: {
    paddingLeft: '10px',
  },
  label: {
    float: 'left',
    paddingTop: '4px',
    paddingRight: '10px',
  },
  labelDropDown: {
    float: 'left',
    paddingRight: '10px',
    paddingTop: '10px',
  },
}))
