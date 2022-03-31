import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  avatarContainer: {
    margin: '0 4.5px',
    '& .MuiAvatar-root': {
      width: 36,
      height: 36,
    },
  },
  popover: {
    marginLeft: '-3px',
    marginTop: 10,
    // background: 'transparent',
  },
}))
