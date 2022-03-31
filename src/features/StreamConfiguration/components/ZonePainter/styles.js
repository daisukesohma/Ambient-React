import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  saveButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: spacing(1),
    marginBottom: spacing(1),
  },
}))
