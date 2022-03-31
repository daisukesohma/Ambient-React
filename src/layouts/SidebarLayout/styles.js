import { makeStyles } from '@material-ui/core/styles'

const SIDEBAR_WIDTH = 57

export default makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '8px',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.grey[500],
      borderRadius: '8px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: theme.palette.grey[600],
    },
  },
  sidebarLayout: {
    display: ({ mobile }) => (mobile ? 'block' : 'flex'),
    height: '100%',
  },
  main: {
    height: '100%',
    width: '100%',
    flexGrow: 1,
    boxSizing: 'border-box',
    padding: ({ spacing }) => theme.spacing(spacing),
    paddingLeft: ({ mobile, spacing }) =>
      (mobile ? SIDEBAR_WIDTH : 0) + theme.spacing(spacing),
    minHeight: ({ mobile }) => (mobile ? '100vh' : 'unset'),
    maxHeight: ({ mobile }) => (mobile ? '100vh' : 'unset'),
    overflowY: ({ mobile }) => (mobile ? 'auto' : 'overlay'),
    overflowX: ({ mobile }) => (mobile ? 'hidden' : 'overlay'),
  },
}))
