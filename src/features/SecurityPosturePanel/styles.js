import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

const panelBarHeight = 60
const panelWidth = 256

export default makeStyles(({ spacing, palette }) => ({
  root: ({ isOpened }) => ({
    height: isOpened ? '33%' : null,
    position: 'absolute',
    bottom: isOpened ? 10 : 0,
    left: 270,
    width: panelWidth,
    maxWidth: panelWidth,
    boxShadow: 'rgba(34, 36, 40, 0.1) 0px 1px 30px',
    zIndex: 1,
  }),
  temp: {
    height: 40,
    minHeight: 40,
    fontWeight: 500,
    fontSize: 10,
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    color: palette.common.white,
    paddingBottom: 12,
    paddingLeft: 50,
  },
  createdBy: ({ darkMode }) => ({
    cursor: 'pointer',
    color: darkMode ? palette.common.white : palette.grey[800],
    fontSize: 10,
    lineHeight: '12px',
    paddingTop: '5px',
  }),
  remainingTime: ({ darkMode }) => ({
    cursor: 'pointer',
    color: darkMode ? palette.common.white : palette.grey[800],
    fontSize: 10,
  }),
  card: ({ darkMode }) => ({
    paddingTop: '10px',
    paddingBottom: '15px',
    borderBottom: `2px solid ${
      darkMode ? palette.grey[700] : palette.grey[300]
    }`,
  }),
  chip: {
    maxWidth: '50%',
    display: 'flex',
    '& + div': {
      marginLeft: '5px',
    },
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '8px',
  },
  top: {
    height: 40,
    minHeight: 40,
    fontWeight: 500,
    fontSize: 10,
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    color: palette.common.white,
    paddingBottom: 12,
  },

  header: {
    position: 'relative',
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    cursor: 'pointer',
    // height: panelBarHeight,
    width: '100%',
    paddingLeft: spacing(0.1),
    paddingRight: spacing(0.1),
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },

  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },

  controls: ({ isOpened }) => ({
    marginBottom: isOpened ? '14px' : '13px',
    marginTop: 10,
  }),

  icon: {
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
    },
  },

  tickerContainer: ({ isOpened }) => ({
    width: '100%',
    backgroundColor: hexRgba(palette.primary.main, isOpened ? 0.2 : 0.7),
    borderRadius: '2px 2px 0 0',
  }),

  body: ({ darkMode }) => ({
    height: `calc(100% - ${panelBarHeight}px)`,
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
    display: 'flex',
    flexDirection: 'column',
  }),

  column: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },

  groupHeader: {
    height: 40,
    minHeight: 40,
    fontWeight: 500,
    fontSize: 10,
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    color: palette.grey[500],
    marginLeft: spacing(1.5),
  },

  nameBlock: ({ darkMode }) => ({
    cursor: 'pointer',
    color: darkMode ? palette.common.white : palette.grey[800],
  }),

  emptyList: {
    color: palette.grey[500],
  },
  wallRotationLabel: {
    margin: spacing(0.25, 1, 0.5, 1),
    color: palette.grey[300],
  },
  idleLabel: {
    margin: spacing(0.25, 1, 0.5, 1),
    color: palette.grey[300],
    paddingTop: '2px',
  },
  idleContainer: {
    height: '20px',
  },
}))
