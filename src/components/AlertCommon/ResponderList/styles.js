import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  ResponderList: {
    '&&': {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  noneText: {
    color: palette.grey[500],
    textAlign: 'center',
  },
  status: {
    marginRight: spacing(1),
  },
  listItemButton: {
    width: 'auto',
    padding: 0,
    margin: '8px 16px',
    borderRadius: 20,
  },
}))
