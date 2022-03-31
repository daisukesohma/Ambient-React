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
  selectStream: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    padding: spacing(1, 2),
    color: darkMode ? palette.grey[100] : palette.grey[700],
  }),
  streamText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  roomIconContainer: {
    marginLeft: spacing(2),
    height: '18px',
  },
  roomIconfontSizeSmall: {
    fontSize: '13px',
  },
}))
