import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, shadows }) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    boxShadow: shadows[5],
    padding: spacing(4, 5, 4, 4),
    position: 'relative',
  },
  modalCloseBtn: {
    top: spacing(0.5),
    right: spacing(0.5),
    position: 'absolute',
    cursor: 'pointer',
  },
}))
