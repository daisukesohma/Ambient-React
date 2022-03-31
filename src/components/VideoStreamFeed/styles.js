import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  videoRoot: ({ isOnVideoWall, isOnAlertModal }) => {
    // default, if it's on a video wall
    let height = '100%'
    const width = '100%'
    if (!isOnVideoWall || isOnAlertModal) {
      height = 'calc(100vh - 132px)'
    }

    // We may need to add future conditions for different places the videostream appears
    return {
      width,
      height,
    }
  },
}))
