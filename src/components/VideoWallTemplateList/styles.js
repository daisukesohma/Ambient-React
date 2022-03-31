import { makeStyles } from '@material-ui/core/styles'
import { isUndefined } from 'lodash'

export default makeStyles(({ spacing }) => ({
  templateContent: ({ width }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: isUndefined(width) ? 'unset' : 'wrap',
    width: isUndefined(width) ? '100%' : width,
  }),
  box: {
    display: 'flex',
    cursor: 'pointer',
    height: 48,
    marginLeft: spacing(1),
  },
}))
