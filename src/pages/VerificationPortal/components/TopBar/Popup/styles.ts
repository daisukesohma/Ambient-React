import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  icon: {
    position: 'relative',
    width: spacing(4.5),
    height: spacing(4.5),
    backgroundColor: palette.common.white,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 4.5px',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: palette.error.main,
    color: palette.common.white,
    top: '-6px',
    right: '-4px',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
  },
  popover: {
    marginLeft: 8,
    marginTop: 10,
  },
}))
