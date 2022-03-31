import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  cell: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 'fit-content',
    alignItems: 'center',
  },
  expired: {
    color: palette.grey[500],
  },
}))
