import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    width: '100%',
    height: '100%',
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    maxWidth: 600,
    backgroundColor: palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '8px 24px',
    '& .title': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  federationIdWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    boxSizing: 'border-box',
    height: 32,
    borderRadius: 4,
    backgroundColor: palette.grey[200],
    fontSize: 10,
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: palette.common.black,
  },
  divider: {
    width: '100%',
  },
  bottom: {
    padding: '8px 24px',
  },
  subTitle: {
    fontSize: 16,
    margin: '8px 0',
  },
  itemContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #F2F4F7',
    padding: 16,
    cursor: 'pointer',
  },
  name: {
    fontSize: 14,
  },
  email: {
    fontSize: 14,
    color: palette.grey[700],
  },
  listContainer: {
    padding: '8px 24px',
    width: '100%',
  },
  list: {
    minHeight: 300,
    overflowY: 'auto',
    border: '1px solid #F2F4F7',
    boxShadow: '0px 1px 4px rgba(34, 36, 40, 0.05)',
    borderRadius: 4,
  },
}))
