import Slider from '@material-ui/core/Slider'
import { withStyles } from '@material-ui/core/styles'
// src
import { hexRgba } from 'utils'

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const size = 12

export default withStyles(({ palette }) => ({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '15px 0',
  },
  thumb: {
    height: size,
    width: size,
    backgroundColor: hexRgba(palette.primary[500], 0.88),
    boxShadow: iOSBoxShadow,
    marginTop: -size / 2,
    marginLeft: -size / 2,
    '&:focus, &:hover, &$active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  valueLabel: {
    // left: 'calc(-50% + 12px)',
    // top: -22,
    // '& *': {
    //   background: 'transparent',
    //   color: '#000',
    // },
    display: 'none',
  },
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: hexRgba(palette.primary[500], 0.66),
  },
  mark: {
    backgroundColor: hexRgba(palette.primary.main, 0.12),
    height: 2,
    width: 1,
    marginTop: 0,
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
}))(Slider)
