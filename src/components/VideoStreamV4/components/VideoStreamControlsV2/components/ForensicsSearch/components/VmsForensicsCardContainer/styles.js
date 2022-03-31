import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  streamContainer: {
    height: 'fit-content',
    padding: spacing(2),
    boxSizing: 'border-box',
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: spacing(0.5),
    '&:hover': {
      border: `1px solid ${palette.primary[300]}`,
    },
  },
  cardName: {
    color: palette.common.white,
  },
}))
