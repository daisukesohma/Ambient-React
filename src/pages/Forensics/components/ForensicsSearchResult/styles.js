import { makeStyles } from '@material-ui/core/styles'
import { isMobileOnly } from 'react-device-detect'

export default makeStyles(({ spacing }) => ({
  root: {
    boxSizing: 'border-box',
    height: '100%',
    padding: spacing(1, 0, 0, 1),
    overflow: 'hidden',
    position: 'relative',
  },
  streamsContainer: {
    height: `inherit`,
    flexWrap: 'wrap',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: 6,
      borderRadius: 4,
    },
  },
  streamsContainerNoResults: {},
  streamsContainerLoading: {
    opacity: 0.2,
    pointerEvents: 'none',
  },
  streamContainer: {
    marginBottom: spacing(2),
    marginRight: spacing(2),
    padding: spacing(1),
    boxSizing: 'border-box',
    borderRadius: spacing(0.5),
    '& svg': {
      marginRight: spacing(1),
    },
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50% -50%)',
  },
  headerBar: {
    margin: spacing(2, 0, 4, 0),
    height: spacing(3),
  },
  paginationContainer: {
    boxSizing: 'border-box',
    width: `calc(100% - ${spacing(4)}px)`,
  },
  results: {
    height: '90%',
  },
}))
