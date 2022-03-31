import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  modalBody: ({ darkMode }) => ({
    background: darkMode ? palette.grey[900] : palette.grey[100],
    color: darkMode ? palette.common.white : palette.common.black,
    margin: spacing(2, 0),
    padding: spacing(2),
  }),
  userInformation: {
    marginLeft: spacing(2),
  },
  listItem: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  row: {
    height: 'fit-content',
    marginBottom: '8px',
  },
  text: {
    margin: 0,
  },
  labelContainer: {
    minWidth: 64,
    padding: spacing(1, 2, 1, 2),
    marginRight: spacing(1),
    fontWeight: 900,
    display: 'flex',
    fontSize: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: palette.grey[500],
    whiteSpace: 'break-spaces',
    width: '64px',
  },
}))
