import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  badge: {
    backgroundColor: palette.error.main,
    color: palette.common.white,
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    borderRadius: 4,
    marginLeft: 5,
  },
  controlBarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  controlBarItemContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  streamsSearch: {
    minWidth: 230,
  },
  expandContainer: {
    position: 'absolute',
    left: 'calc(50% - 28px)',
    top: '-28px',
    textAlign: 'center',
    cursor: 'pointer',
    zIndex: 1,
  },
  expander: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandLabel: {
    fontSize: 14,
    color: palette.primary.main,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  historyTitle: {
    marginRight: `${spacing(1)} !important`,
  },
  instancesContainer: {
    padding: '0px 50px',
  },
  root: ({ darkMode }) => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    background: darkMode ? palette.grey[800] : palette.grey[200],
    zIndex: 1,
  }),
  searchBarContainer: {
    minWidth: 240,
  },
  switch: {
    '&& .MuiButtonBase-root': {
      padding: 9,
      position: 'absolute',
    },
    '&& .MuiIconButton-label': {
      color: '#F8FBFF',
    },
    '&& .Mui-checked .MuiIconButton-label': {
      color: '#1881FF',
    },
  },
  timeSpan: {
    fontSize: 14,
    color: palette.grey[700],
    marginLeft: 8,
    marginRight: 8,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    color: palette.error.main,
    backgroundColor: '#FFE1E7',
    fontSize: 14,
    padding: '4px 8px',
    borderRadius: 4,
  },
  unexpandedContainer: {
    display: 'flex',
    padding: '24px 50px',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    borderTop: `1px solid ${palette.grey[500]}`,
  },
  viewLabel: {
    fontSize: 14,
    color: palette.grey[700],
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: palette.primary.main,
    '&:hover': {
      backgroundColor: palette.primary.main,
    },
  },
  addIcon: {
    color: palette.common.white,
  },
}))
