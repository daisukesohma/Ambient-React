import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  container: ({ darkMode }) => ({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    marginTop: 0,
    color: darkMode ? palette.common.white : palette.common.black,
    textAlign: 'center',
  }),
  logo: {
    width: 88,
  },
}))
