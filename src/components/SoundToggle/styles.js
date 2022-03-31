import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  icon: ({ speechIsMuted }) => ({
    color: speechIsMuted ? palette.grey[500] : palette.error.main,
  }),
}))
