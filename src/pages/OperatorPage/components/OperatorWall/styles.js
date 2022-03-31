import { makeStyles } from '@material-ui/core/styles'
import isNumber from 'lodash/isNumber'
import get from 'lodash/get'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    height: '100%',
    position: 'relative',
  },

  videoWallContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  gridContainer: ({ topBarPanelOpened, activeVideoWall }) => ({
    display: 'grid',
    boxSizing: 'border-box',
    gridTemplateColumns: `repeat(${
      isNumber(get(activeVideoWall, 'template.columnCount'))
        ? get(activeVideoWall, 'template.columnCount')
        : 12
    }, 1fr)`,
    gridTemplateRows: `repeat(${
      isNumber(get(activeVideoWall, 'template.rowCount'))
        ? get(activeVideoWall, 'template.rowCount')
        : 12
    }, 1fr)`,
    gridColumnGap: 7,
    gridRowGap: 7,
    padding: spacing(1),
    height: topBarPanelOpened ? 'calc(100% - 108px)' : 'calc(100% - 40px)',
  }),

  gridItem: {
    border: `solid 1px ${palette.common.black}`,
    width: '100%',
    height: '100%',
    background: palette.common.black,
  },

  isDroppableActive: {
    border: `4px solid ${palette.primary.main}`,
    boxSizing: 'border-box',
  },

  progressBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },

  toolbar: ({ topBarPanelOpened }) => ({
    display: topBarPanelOpened ? 'flex' : 'none',
    alignItems: 'center',
    paddingTop: topBarPanelOpened ? 8 : 0,
    paddingLeft: topBarPanelOpened ? 8 : 0,
    minHeight: topBarPanelOpened ? 60 : 0,
  }),

  toolbarWrapper: {
    position: 'relative',
  },

  optionSelector: {
    minWidth: 180,
    zIndex: 999,
  },

  displayController: ({ isToolsVisible }) => ({
    width: 36,
    height: 36,
    color: palette.common.white,
    backgroundColor: palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute',
    right: 8,
    borderRadius: '50%',
    boxShadow: 'rgba(34, 36, 40, 0.2) 0px 2px 6px',
    bottom: isToolsVisible ? -18 : -24,
    zIndex: 1,
  }),

  profileSelectorWrapper: {
    width: '100%',
    '&::-webkit-scrollbar': {
      height: 6,
      borderRadius: spacing(0.5),
    },
  },

  bottomToolbar: {
    height: 40,
    width: '100%',
  },
}))
