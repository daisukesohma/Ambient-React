import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '10px 0',
    width: '100%',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  gridListTile: {
    width: '350px !important',
    height: '100% !important',
    margin: '10px !important',
    padding: '0px !important',
    '&:hover': {
      boxShadow:
        '0px 1px 10px rgba(24, 129, 255, 0.2), 0px 4px 5px rgba(34, 36, 40, 0.08), 0px 2px 4px rgba(98, 100, 105, 0.2)',
    },
  },
  rootEmpty: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    color: palette.grey[700],
    padding: spacing(4),
  },
}))
