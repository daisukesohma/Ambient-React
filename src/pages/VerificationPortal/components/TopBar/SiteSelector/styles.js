import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    minWidth: 375,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 375,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'calc(100% - 32px)',
    padding: 16,
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.primary.main,
  },
  icon: {
    paddingLeft: 4,
    paddingTop: 4,
  },
  title: {
    fontSize: 16,
    padding: '0 16px',
  },
  body: {
    padding: '16px 0',
  },
  chipsContainer: {
    padding: '0 16px',
    maxHeight: 350,
    overflowY: 'auto',
  },
  chipRoot: {
    backgroundColor: `${palette.primary[50]} !important`,
    borderRadius: '4px !important',
    margin: '2px 4px !important',
  },
  selectedChip: {
    backgroundColor: `${palette.grey[700]} !important`,
    borderRadius: '4px !important',
    margin: '2px 4px !important',
    color: `${palette.common.white} !important`,
  },
  closeIcon: {
    width: 16,
    height: 16,
    backgroundColor: palette.common.white,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: spacing(0, 2, 2, 2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  footerButton: {
    margin: spacing(0, 0.5, 0, 0.5),
  },
  searchInput: {
    width: '100%',
    margin: '8px 0',
  },
  searchText: {
    fontSize: 16,
    color: palette.grey[500],
    padding: '2px 16px',
    width: '100%',
  },
  searchIcon: {
    color: palette.grey[500],
    fontSize: 24,
  },
}))
