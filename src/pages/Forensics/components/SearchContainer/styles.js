import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    background: palette.background.levels[1],
    padding: spacing(2, 3, 0, 3),
  },
  topBar: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  maxHeight: {
    height: '100%',
  },
}))
