import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  card: props => ({
    width: 250,
    background: theme.palette.common.white,
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 4,
    position: 'absolute',
    left: props.positionX,
    bottom: '180px',
    transform: 'translate(-50%)',
  }),
  cardContent: {
    '&&': {
      display: 'flex',
      padding: 2,
      flexDirection: 'column',
      backgroundColor: theme.palette.common.white,
    },
    '& img': {
      minHeight: 180,
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    padding: '8px 0',
    margin: '0 16px',
    color: theme.palette.common.black,
    borderBottom: `2px solid ${theme.palette.grey[200]}`,
    textAlign: 'left',
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
  },
  cardTimeStamp: {
    display: 'flex',
    color: theme.palette.grey[500],
    fontSize: 14,
  },
  cardActions: {
    display: 'flex',
    cursor: 'pointer',
    marginLeft: 10,
    width: 50,
    justifyContent: 'space-between',
  },
}))

export default useStyles
