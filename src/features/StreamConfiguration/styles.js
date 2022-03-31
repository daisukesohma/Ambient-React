import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  maximized: {
    height: '100%',
  },
  overflowY: {
    overflowY: 'auto',
  },
  borderRight: {
    borderRight: `1px solid ${palette.grey[800]}`,
  },
}))
