import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  streamIndicator: {
    padding: '2px 10px',
    textTransform: 'none',
    backgroundColor: palette.grey[100],
  },

  streamChip: {
    backgroundColor: palette.grey[300],
    borderRadius: '0px',
    margin: '2px',
  },

  active: {
    backgroundColor: palette.primary[100],
  },

  filterWrapper: {
    '& >div': {
      border: 'none',
      marginLeft: 8,
      '& >div': {
        padding: 0,
      },
    },
  },
}))
