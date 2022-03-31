import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  paper: {
    color: palette.common.white,
  },
  // TODO: find better way to set 100% of w/h for <VictoryChart/> aka .VictoryContainer
  paperRoot: {
    height: '100%',
    '& .VictoryContainer > svg': {
      width: '100% !important',
      height: '100% !important',
    },
    '& .VictoryContainer > div': {
      height: '100% !important',
    },
    '& .VictoryContainer > div > svg': {
      height: '100% !important',
    },
  },
  textColor: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.common.black,
  }),
  selectedRange: {
    backgroundColor: `${palette.primary.main} !important`,
    color: palette.common.white,
  },
  disabledRange: {
    color: '#9fa2a7 !important',
  },
  wrap: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  whiteSpace: {
    whiteSpace: 'nowrap',
  },
  chartContainer: {
    height: '400px',
    overflow: 'scroll',
  },
  select: {
    fontSize: '12px',
  },
  metricSubtext: {
    size: '10px',
    color: '#a6a6a6',
  },
  deleteButton: {
    color: palette.error.main,
  },
  conditionSetButton: {
    color: palette.primary.main,
  },
  conditionUnsetButton: {
    color: palette.grey[500],
  },
}))
