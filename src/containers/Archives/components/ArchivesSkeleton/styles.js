import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  header: {
    display: 'flex',
    padding: 16,
    alignItems: 'flex-end',
    zIndex: 1,
  },
  item: {
    width: '100%',
    height: 200,
    backgroundColor: palette.grey[400],
  },
  filter: {
    width: '100%',
    height: 80,
    backgroundColor: palette.grey[400],
  },
}))
