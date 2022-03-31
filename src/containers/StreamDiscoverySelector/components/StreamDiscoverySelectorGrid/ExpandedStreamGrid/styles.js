import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  rootItem: {
    width: '100%',
    willChange: 'transform, opacity, width, height',
  },
  container: {
    width: '100%',
    marginTop: theme.spacing(2),
    willChange: 'width, height',
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    position: 'relative',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    background: theme.palette.grey[300],

    padding: theme.spacing(2, 2),
    margin: '24px 0 0 0 !important',
    marginTop: theme.spacing(3),
    '&::-webkit-scrollbar': {
      height: 12,
      borderRadius: 4,
      background: theme.palette.grey[500],
    },
    '&::-webkit-scrollbar-thumb': {
      height: 12,
      borderRadius: 4,
      background: theme.palette.grey[500],
    },
  },
  gridListTile: {
    minWidth: 336,
    padding: `2.25px !important`,
    paddingRight: `${theme.spacing(2)}px !important`,
    height: '100% !important',
  },
  fabRoot: {
    borderRadius: '50% !important',
    background: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.primary[50],
    },
  },
  fabContainer: {
    position: 'absolute',
    top: '50%',
    right: 16,
    background: theme.palette.common.white,
    borderRadius: '50%',
  },
  fabIconColor: {
    color: theme.palette.primary[300],
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))
