import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    background: palette.common.black,
    boxShadow: '0px 2px 6px rgba(34, 36, 40, 0.2)',
    borderRadius: 4,
    padding: '4px 8px',
  },
  item: {
    fontSize: 14,
    color: palette.common.white,
    padding: '4px 0',
    cursor: 'pointer',
    '&:hover': {
      color: palette.primary.main,
    },
  },
}))
