import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  eventContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingTop: 25,
    paddingRight: 15,
    paddingBottom: 0,
  },
  labelContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingLeft: 25,
    paddingBottom: 5,
    paddingRight: 10,
  },
  label: {
    color: palette.grey[500],
  },
  value: ({ darkMode }) => ({
    color: darkMode ? palette.grey[500] : palette.common.black,
  }),
  underline: ({ darkMode }) => ({
    color: darkMode ? palette.grey[500] : palette.common.black,
    borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    '&:after': {
      borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    },
    '&:focused::after': {
      borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    },
    '&:error::after': {
      borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    },
    '&:before': {
      borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    },
    '&:hover:not($disabled):not($focused):not($error):before': {
      borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    },
    '&$disabled:before': {
      borderBottomColor: darkMode ? palette.grey[500] : palette.common.black,
    },
  }),
  id: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[600],
  }),
  status: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  formControl: {
    margin: spacing(1),
    minWidth: 550,
    maxWidth: 550,
  },
  inputField: {
    color: palette.common.white,
    '& input': {
      color: palette.common.white,
    },
    '& label': {
      color: palette.grey[600],
      fontSize: 12,
      fontFamily: 'Aeonik',
    },
  },
  threatSignatureName: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 35,
    paddingBottom: 20,
  },
  failureReasons: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingBottom: 20,
  },
  other: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    color: palette.grey[500],
  },
}))
