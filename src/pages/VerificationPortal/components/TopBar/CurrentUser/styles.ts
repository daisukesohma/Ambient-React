import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  avatarContainer: {
    margin: '0 4.5px',
    '& .MuiAvatar-root': {
      width: spacing(4.5),
      height: spacing(4.5),
    },
  },
  popover: {
    marginLeft: '-3px',
    marginTop: spacing(1.25),
  },

  tooltipText: {
    padding: spacing(0.25, 1),
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: spacing(0.5),
  },

  iconContainer: {
    border: `2px solid ${palette.primary.main}`,
    borderRadius: spacing(2.75),
    cursor: 'pointer',
  },
}))
