import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({ darkMode }) => ({
    borderRadius: 4,
    background: darkMode ? palette.common.black : palette.common.white,
    boxSizing: 'border-box',
    color: darkMode ? palette.common.white : palette.common.black,
    display: 'flex',
    width: '100%',
  }),
}))
