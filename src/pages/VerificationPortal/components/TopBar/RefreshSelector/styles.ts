import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  icon: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: `2px solid ${palette.primary.main}`,
    borderRadius: spacing(2.75),
    cursor: 'pointer',
  },

  tooltipText: {
    padding: spacing(0.25, 1),
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: spacing(0.5),
  },
}))
