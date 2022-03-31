import { makeStyles } from '@material-ui/core/styles'

const WIDTH_START = 300
const WIDTH_END = 450
const WIDTH_DIFF = WIDTH_END - WIDTH_START

export default makeStyles(({ spacing }) => ({
  containerRoot: ({ isMobileOnly }) => ({
    width: isMobileOnly ? '100%' : 'auto',
    marginLeft: isMobileOnly ? 0 : WIDTH_DIFF,
    marginRight: isMobileOnly ? 0 : spacing(3),
    marginTop: isMobileOnly ? spacing(1) : 0,
    marginBottom: isMobileOnly ? spacing(1) : 0,
  }),
}))
