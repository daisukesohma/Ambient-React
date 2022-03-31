import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ isExpanded }) => ({
    background: palette.background.paper,
    border: `1px solid ${palette.grey[800]}`,
    borderRadius: spacing(0.5),
    bottom: -64,
    left: spacing(1),
    maxHeight: isExpanded ? 212 : 96,
    height: isExpanded ? 212 : 96,
    padding: spacing(2),
    position: 'absolute',
    width: `calc(100% - ${spacing(7)}px)`,
  }),
  streamsWrapper: ({ isExpanded }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    maxHeight: isExpanded ? 196 : 48,
    height: isExpanded ? 196 : 48,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 6,
    },
  }),
  streamChip: ({ isExpanded }) => ({
    display: isExpanded ? 'block' : 'none',
    padding: spacing(0.5, 1),
    borderRadius: 4,
    marginTop: spacing(1),
    marginRight: spacing(1),
    textTransform: 'none',
    fontSize: `12px !important`,
  }),
}))
