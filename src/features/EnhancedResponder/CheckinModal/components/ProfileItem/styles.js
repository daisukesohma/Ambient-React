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
}))
