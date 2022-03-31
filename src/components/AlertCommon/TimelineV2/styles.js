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
    padding: '10px 10px',
    color: palette.common.black,
  },
  TimeLineFooter: {
    height: 60,
    padding: '10px 20px',
    background: '#FAFBFD',
    borderTop: '1px solid #EAECF1',
    borderBottom: '1px solid #EAECF1',
    position: 'relative',
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
