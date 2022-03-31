import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  maxHeight: {
    // height: '100%',
  },
  accountCard: {
    borderRadius: 10,
    borderColor: palette.border.default,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  listItem: {
    padding: 0,
    fontSize: 5,
  },
  listItemText: {
    lineHeight: '20px',
    fontSize: 14,
  },
}))
