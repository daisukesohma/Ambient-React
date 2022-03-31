import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  LinearProgressRoot: {
    marginTop: 10,
    height: 3,
  },
  lineItem: {
    margin: '0 1.5% 0 1.5%',
  },
  TimeLineItemHeader: {
    padding: spacing(1, 2),
  },
  TimeLineBody: {
    width: '100%',
    height: 'calc(100% - 180px)',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: spacing(1),
    },
  },
  TimeLineFooter: {
    height: 100,
    padding: spacing(1, 2),
    border: `1px solid ${palette.grey[700]}`,
    position: 'relative',
    overflow: 'hidden',
  },
  NoWrapGrid: {
    flexWrap: 'nowrap',
  },
  CircularProgressBlock: {
    marginRight: spacing(2),
    display: 'flex',
  },
  sendButton: ({ isValid }) => ({
    cursor: isValid ? 'pointer' : 'not-allowed',
    position: 'absolute',
    right: spacing(2),
    bottom: 0,
  }),
}))
