import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  formControl: {
    margin: spacing(3),
    minWidth: 150,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
  },
}))
