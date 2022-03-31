import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  paper: ({ darkMode }) => ({
    background: darkMode ? palette.common.black : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    borderRadius: spacing(1),
    border: `1px solid ${darkMode ? palette.grey[800] : palette.common.white}`,
  }),
  tables: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: spacing(2),
  },
  tableHeader: {
    paddingBottom: spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  tableTitleH: {
    marginLeft: 4,
  },
}))
