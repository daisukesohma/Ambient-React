import { makeStyles } from '@material-ui/core/styles'
import { VP_TOP_BAR_HEIGHT } from '../../constants'

const expandIconSize = 56

export const useStyles = makeStyles(({ spacing, palette }) => ({
  refreshIcon: {
    color: palette.primary.main,
    padding: spacing(1.25, 1.5, 0, 1.5),
    cursor: 'pointer',
  },
  multiSelect: {
    color: palette.common.black,
    margin: spacing(0, 1, 0, 1),
  },

  expandContainer: {
    width: expandIconSize,
    height: expandIconSize,
    position: 'fixed',
    top: '50%',
    borderRadius: '50%',
    backgroundColor: palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      width: expandIconSize * 2,
      height: expandIconSize * 2,
      top: `calc(50% - ${expandIconSize / 2}px)`,
    },
  },
  expandedIcon: ({ fullScreen }) => ({
    zIndex: 1201,
    right: `calc(${fullScreen ? 100 : 50}% - ${expandIconSize / 2}px)`,
    '&:hover': {
      right: `calc(${fullScreen ? 100 : 50}% - ${expandIconSize}px)`,
    },
  }),
  notExpandedIcon: {
    right: `-${expandIconSize / 2}px`,
    '&:hover': {
      right: `-${expandIconSize}px`,
    },
  },
  historyTitle: {
    marginRight: `${spacing(1)} !important`,
  },
  instancesContainer: ({ darkMode }) => ({
    background: darkMode ? palette.grey[800] : palette.grey[200],
  }),
  root: ({ darkMode }) => ({
    display: 'flex',
    flexDirection: 'column',
    background: darkMode ? palette.grey[800] : palette.grey[200],
    zIndex: 1,
    flex: 1,
    marginBottom: VP_TOP_BAR_HEIGHT - 2,
  }),
  drawerPaper: ({ fullScreen }) => ({
    width: fullScreen ? '100%' : '50%',
    top: VP_TOP_BAR_HEIGHT,
    border: 'none',
  }),
  accordionRoot: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[200],
  }),
}))
