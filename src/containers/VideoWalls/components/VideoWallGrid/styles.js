import { makeStyles } from '@material-ui/core/styles'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'

export default makeStyles(theme => ({
  root: ({ darkMode }) => ({
    height: '100%',
    backgroundColor: darkMode
      ? theme.palette.common.black
      : theme.palette.grey[100],
    color: darkMode ? theme.palette.common.white : theme.palette.common.black,
    position: 'relative',
  }),
  descriptionText: ({ darkMode }) => ({
    color: darkMode ? theme.palette.grey[300] : theme.palette.grey[700],
  }),
  videoWallContainer: ({ isEdit }) => ({
    width: '100%',
    height: isEdit ? 'calc(100vh - 140px)' : 'calc(100vh - 50px)',
  }),
  gridContainer: ({ activeVideoWall }) => ({
    display: 'grid',
    boxSizing: 'border-box',
    // TODO: will need to remove this condition after BE updates
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
    padding: theme.spacing(1),
    height: '100%',
  }),
  gridItem: {
    border: `solid 1px ${theme.palette.common.black}`,
    width: '100%',
    height: '100%',
    background: theme.palette.common.black,
  },

  isDroppableActive: {
    border: `4px solid ${theme.palette.primary.main}`,
    boxSizing: 'border-box',
  },

  progressBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
  },
}))
