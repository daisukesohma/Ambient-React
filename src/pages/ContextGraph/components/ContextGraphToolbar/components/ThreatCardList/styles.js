import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  subheader: {
    // background: palette.common.black,
  },
  adornment: {
    marginLeft: spacing(2),
    marginRight: spacing(1),
    color: palette.common.greenPastel,
  },
  root: {
    overflow: 'scroll',
  },
}))
