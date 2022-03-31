import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
  isMobileOnly?: boolean
  clicked?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode, isMobileOnly }: StyleArguments) => ({
    width: isMobileOnly ? 'inherit' : 448,
    padding: spacing(1),
    backgroundColor: palette.grey[darkMode ? 800 : 50],
    border: `1px solid ${palette.grey[darkMode ? 800 : 50]}`,
    borderRadius: spacing(0.5),
    boxShadow: 'black 0px 0px 1px 1px',
  }),
  popper: {
    zIndex: 10000,
  },
  title: ({ darkMode }: StyleArguments) => ({
    color: palette.grey[darkMode ? 50 : 800],
  }),
  relativeRange: ({ darkMode }: StyleArguments) => ({
    borderLeft: '1px solid',
    borderColor: palette.grey[darkMode ? 50 : 800],
  }),
  apply: ({ darkMode }: StyleArguments) => ({
    backgroundColor: darkMode
      ? palette.secondary.main
      : palette.common.tertiary,
    fontSize: 12,
    width: 10,
    '& hover': {
      backgroundColor: palette.grey[500],
    },
  }),
  cancel: ({ darkMode }: StyleArguments) => ({
    backgroundColor: darkMode ? palette.grey[500] : palette.secondary.main,
    fontSize: 12,
    width: 10,
    '& hover': {
      backgroundColor: palette.grey[600],
    },
  }),
  textField: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.secondary.main : palette.common.tertiary,
    backgroundColor: palette.grey[darkMode ? 800 : 50],
    width: 92,
    fontSize: 12,
    padding: spacing(0.5),
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: spacing(0.5),
    textAlign: 'center',
    cursor: 'pointer',
    '&:focus': {
      border: darkMode ? '1px solid #0ABFFC' : '1px solid #4242FF',
      borderRadius: spacing(0.5),
    },
  }),
  timeField: ({ darkMode }: StyleArguments) => ({
    color: darkMode ? palette.secondary.main : palette.common.tertiary,
    backgroundColor: palette.grey[darkMode ? 800 : 50],
    width: 64,
    padding: spacing(0.5),
    textAlign: 'center',
    fontSize: 12,
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: spacing(0.5),
    cursor: 'pointer',
    '&:focus': {
      border: darkMode ? '1px solid #0ABFFC' : '1px solid #4242FF',
      borderRadius: spacing(0.5),
    },
  }),
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  timeSelect: {
    padding: spacing(0.5, 1.25, 1),
    width: '100%',
  },
  separator: ({ darkMode }: StyleArguments) => ({
    color: palette.grey[darkMode ? 50 : 800],
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
  }),
  calendarPortal: {
    zIndex: 9999,
    position: 'absolute',
  },
  calendar: ({ darkMode }: StyleArguments) => ({
    backgroundColor: palette.grey[darkMode ? 50 : 800],
    color: palette.grey[darkMode ? 50 : 800],
  }),
  label: {
    cursor: 'pointer',
    outline: 'none',
  },
  error: {
    color: palette.error.main,
    fontSize: 12,
    paddingLeft: spacing(1),
  },
}))
