import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette, spacing }) => ({
  details: {
    display: 'block',
  },
  detail: {
    display: 'flex',
  },
  detailHeader: {
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
    display: 'flex',
    paddingRight: spacing(1),
    wordBreak: 'keep-all',
  },
  data: {
    wordBreak: 'break-all',
  },
  a: {
    color: palette.primary.light,
  },
  annotations: {
    overflow: 'auto',
    maxHeight: '140px',
    minWidth: '200px',
    background: palette.text.disabled,
  },
}))
