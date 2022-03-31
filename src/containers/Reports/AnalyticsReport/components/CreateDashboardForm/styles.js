import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  modal: ({ darkMode }) => ({
    position: 'absolute',
    width: '25%',
    left: '40%',
    top: '10%',
    background: darkMode ? palette.grey[900] : palette.common.white,
    padding: spacing(3),
    border: `1px solid ${palette.grey[700]}`,
  }),
}))
