import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  am_root: {
    padding: spacing(2),
    boxShadow: 'none',
    position: 'relative',
    border: `1px solid ${palette.border.default}`,
  },
  am_chart: {
    padding: spacing(3, 4, 1, 4),
    display: 'flex',
    height: 'calc(100% - 56px)',
    '&>svg': {
      width: '100%',
    },
  },
  am_legend: {
    position: 'absolute',
    top: spacing(1),
    right: spacing(1),
    zIndex: 10,
    pointerEvents: 'none',
  },
}))
