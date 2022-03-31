import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    padding: '8px 14px',
  },
  label: {
    color: palette.grey[500],
  },
  value: {
    color: palette.common.white,
  },
}))
