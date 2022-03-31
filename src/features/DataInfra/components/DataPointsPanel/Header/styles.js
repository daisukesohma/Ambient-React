import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  headerContainer: {
    height: 'fit-content',
    flexGrow: 1,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  paper: {
    flexGrow: 1,
  },
  viewLabel: {
    fontSize: 12,
    color: palette.grey[500],
  },
  formControl: {
    minWidth: 250,
    maxWidth: 250,
  },
  InputLabel: {
    color: palette.grey[500],
  },
  select: {
    '&:before': {
      borderColor: palette.primary.light,
    },
    '&:after': {
      borderColor: palette.primary.light,
    },
  },
  icon: {
    fill: palette.primary.light,
  },
}))
