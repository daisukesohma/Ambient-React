import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  wrapper: {
    // backgroundColor: palette.common.black,
    backgroundColor: palette.background.levels[1],
    // color: palette.common.white,
    boxSizing: 'border-box',
  },
  searchContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    height: 94, // hardcode to avoid thrash
    justifyContent: 'center',
    width: '100%',
    // background: palette.common.black,
    background: palette.background.levels[1],
  },
}))
