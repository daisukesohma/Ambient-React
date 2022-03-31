import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  title: {
    margin: '16px 0',
  },
  textColor: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
}))
