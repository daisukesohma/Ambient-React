import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  container: {
    backgroundColor: palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    marginBottom: '24px',
    padding: 24,
  },
  textField: {
    marginRight: spacing(1),
    width: '100%',
    height: 50,
    backgroundColor: palette.grey[400],
    marginBottom: 16,
  },
  avatar: {
    width: 155,
    height: 155,
    backgroundColor: palette.grey[400],
  },
  avatarInfo: {
    marginLeft: 16,
    flex: 1,
  },
  flexItem: {
    display: 'flex',
  },
}))
