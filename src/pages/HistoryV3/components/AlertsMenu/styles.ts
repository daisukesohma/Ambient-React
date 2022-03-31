import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  listItemRoot: {
    '&:hover': {
      backgroundColor: palette.background.layer[2],
    },
  },
}))
