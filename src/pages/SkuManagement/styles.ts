import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  toast: {
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 200px)',
    width: 'fit-content',
    background: palette.grey[800],
    borderRadius: 4,
    padding: 8,
    color: palette.grey[200],
    border: `1px solid ${palette.common.greenBluePastel}`,
  },
}))
