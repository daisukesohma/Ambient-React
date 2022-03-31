import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  streamItem: {
    padding: spacing(1),
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      background: palette.grey[500],
    },
  },
  activeStream: {
    background: palette.grey[500],
  },

  streamText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
}))
