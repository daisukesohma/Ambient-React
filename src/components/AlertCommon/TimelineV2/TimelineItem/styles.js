import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  timeLineItem: ({ isComment }) => ({
    position: 'relative',
    padding: '10px 20px',
    background: isComment ? '#FFFFFF' : '#DEF4FF',
    '&:hover': {
      background: isComment ? '#E2F1FF' : '#ABE4FE',
    },
  }),
  noWrapGrid: {
    flexWrap: 'nowrap',
  },
  manageIcons: {
    position: 'absolute',
    right: theme.spacing(1),
    cursor: 'pointer',
  },
  timeLineItemTime: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.15,
    color: '#626469',
  },
  timeLineItemTitle: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.15,
    color: '#222428',
  },
  timeLineItemText: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: 0.15,
    color: '#222428',
  },
  timeLineItemTimeAgo: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: '20px',
    letterSpacing: 0.4,
    color: '#9FA2A7',
  },
  timelineContact: {
    display: 'flex',
    marginTop: '2px',
  },
  timelineContactMethod: {
    marginRight: '4px',
    marginTop: '4px',
  },
  timelineContactName: {
    marginLeft: '4px',
    marginTop: '4px',
  },
}))
