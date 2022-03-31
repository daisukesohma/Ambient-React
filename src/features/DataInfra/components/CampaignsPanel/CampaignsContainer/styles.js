import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    // flexWrap: 'wrap',
    justifyContent: 'space-around',
    // overflow: 'hidden',
    paddingTop: theme.spacing(1),
  },

  gridRoot: {
    padding: 'revert',
  },
  gridList: {
    // flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
  },
  gridListTile: {
    height: '100% !important',
    margin: '10px !important',
    padding: '0px !important',
    '&:hover': {
      boxShadow: 'rgba(253, 35, 92, 0.5) 0px 0px 15px 0px',
    },
  },
}))
