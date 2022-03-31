import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  barTotal: ({ darkMode }) => ({
    fill: darkMode ? palette.common.white : palette.common.black,
    textAnchor: 'middle',
  }),
}))
