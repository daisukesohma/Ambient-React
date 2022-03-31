import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }) => ({
    padding: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: 'none',
    height: '100%',
    position: 'relative',
    // background: darkMode ? palette.common.black : palette.common.white,
    border: darkMode ? `1px solid ${palette.grey[700]}` : null,
    // color: darkMode ? palette.common.white : palette.common.black,
  }),
  dataContainer: {
    marginTop: '-48px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    color: palette.grey[700],
    marginLeft: spacing(1),
  },
  description: {
    color: palette.grey[500],
  },
  valueContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: spacing(6, 0, 1, 0),
    alignItems: 'flex-end',
  },
  value: {
    fontFamily: `'Aeonik-Light', 'Roboto'`,
    fontSize: '96px',
    lineHeight: '90px',
  },
  percentValue: {
    marginBottom: spacing(0.5),
    color: palette.grey[500],
  },
  percentSign: {
    fontSize: '20px',
  },
  proportion: {
    fontFamily: `'Aeonik-Light', 'Roboto'`,
    fontSize: '40px',
    color: palette.grey[500],
  },
  totalStr: {
    fontSize: '14px',
    textTransform: 'uppercase',
  },
  moreContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: palette.grey[700],
    opacity: 0.95,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreBtn: {
    cursor: 'pointer',
  },
  closeBtn: {
    cursor: 'pointer',
    width: spacing(3),
    height: spacing(3),
    position: 'absolute',
    right: spacing(1),
    top: spacing(1),
  },
}))
