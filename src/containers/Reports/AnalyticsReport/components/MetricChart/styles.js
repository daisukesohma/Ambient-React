import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  victoryCursorContainer: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.common.black : palette.common.white,
  }),
  liveOccupancyBox: {
    fontSize: '42px',
  },
  svgRoot: {
    height: '100%',
    '& svg': {
      width: '100% !important',
      height: '100% !important',
    },
    '& .VictoryContainer > div': {
      height: '100% !important',
    },
  },
}))
