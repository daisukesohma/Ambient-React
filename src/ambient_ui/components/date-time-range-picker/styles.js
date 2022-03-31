import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  am_container: ({ darkMode, mobile }) => ({
    display: 'flex',
    maxWidth: 370,
    background: darkMode ? palette.grey[800] : palette.grey[50],
    flexDirection: mobile ? 'column' : 'row',
  }),
  am_inputContainer: ({ darkMode }) => ({
    minWidth: 180,
    background: darkMode ? palette.grey[50] : palette.grey[800],
    cursor: 'pointer',
  }),
  am_input: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
    color: darkMode ? palette.grey[50] : palette.grey[800],
    padding: spacing(1),
    textTransform: 'uppercase !important',
    cursor: 'pointer !important',
    fontSize: 12,
    '&:hover': {
      color: palette.primary.main,
    },
  }),
  am_icon: {
    color: palette.grey[500],
    width: 12,
    height: 12,
  },
  am_linkStr: {
    backgroundColor: palette.grey[100],
    color: palette.grey[500],
    paddingTop: spacing(1),
  },
  marker: {
    display: 'flex',
    alignItems: 'center',
    color: palette.grey[500],
  },
  error: {
    color: palette.error.main,
    textAlign: 'center',
  },
  dateTimeLabel: ({ darkMode }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
    color: darkMode ? palette.grey[50] : palette.grey[800],
    borderRadius: 4,
  }),
  datetime: {
    flex: 1,
    padding: '0 8px',
  },
  rangePopoverRoot: ({ mobile }) => ({
    display: 'flex',
    marginRight: spacing(2),
    width: mobile ? '100%' : 'auto',
  }),
}))
