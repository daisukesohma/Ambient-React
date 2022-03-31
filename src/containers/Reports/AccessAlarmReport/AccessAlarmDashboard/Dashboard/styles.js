import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: ({ darkMode }) => ({
    background: darkMode ? palette.common.black : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    borderRadius: spacing(1),
    border: `1px solid ${darkMode ? palette.grey[800] : palette.common.white}`,
  }),
  top: {
    display: 'flex',
  },
  piechart: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  piechartContainer: {
    flex: 1,
    '& .MuiPaper-root': {
      height: 'calc(100% - 34px) !important',
      '& .VictoryContainer': {
        display: 'flex',
      },
    },
  },
  stackedBar: {
    height: '100%',
    position: 'relative',
  },
  tables: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: spacing(2),
  },
  label: {
    padding: spacing(2),
  },
  tableHeader: {
    paddingBottom: spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legend: {
    margin: spacing(2),
  },
  stackedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  alertRoot: {
    textAlign: 'center',
    padding: spacing(0, 2),
  },
  alert: {
    width: 'fit-content',
    margin: spacing(2, 2, 0, 0),
    '& .MuiAlert-icon': {
      alignItems: 'center',
      fontSize: '24px',
    },
    '& .MuiAlert-message': {
      fontSize: '24px',
      minWidth: 162,
    },
  },
  alertSmall: {
    marginTop: spacing(1),
    width: 'fit-content',
    '& .MuiAlert-icon': {
      alignItems: 'center',
      fontSize: '16x',
    },
    '& .MuiAlert-message': {
      fontSize: '16px',
    },
  },
  tableTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  tableTitleH: {
    marginLeft: 4,
  },
  stackedBarRoot: {
    position: 'relative',
    padding: spacing(2),
  },
  stackedTotals: {
    position: 'absolute',
    bottom: 18,
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
}))
