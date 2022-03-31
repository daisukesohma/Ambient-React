import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexFlow: 'nowrap',
    padding: '8px 14px',
  },
  status: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.common.black,
  }),
  label: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[500],
  }),
  value: ({ darkMode }) => ({
    color: darkMode ? palette.grey[600] : palette.common.black,
  }),
  id: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : palette.grey[600],
  }),
}))
