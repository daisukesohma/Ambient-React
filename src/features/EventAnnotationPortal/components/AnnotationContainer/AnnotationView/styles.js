import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({ darkMode }) => ({
    display: 'flex',
    flexDirection: 'row',
    background: darkMode ? palette.grey[800] : palette.grey[100],
    color: darkMode ? palette.common.white : null,
  }),
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '75%',
    transform: 'translate(-50% -75%)',
  },
}))
