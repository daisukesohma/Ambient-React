import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: {
    width: '100%',
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: spacing(3),
  },
  input: {
    fontSize: 16,
    padding: spacing(0.5, 1),
    width: '100%',
  },
  searchIcon: {
    color: palette.grey[500],
  },
  closeIcon: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}))
