import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  skeleton: {
    minHeight: `32px !important`,
    marginBottom: 4,
    transform: 'unset',
    backgroundColor: `${palette.grey[500]} !important`,
  },
}))
