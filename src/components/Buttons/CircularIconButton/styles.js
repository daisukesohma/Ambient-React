import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ palette }) => ({
  root: ({ borderWidth }) => ({
    transition: 'background 30ms cubic-bezier(1,0,0,1) 0ms',
    border: `${borderWidth}px solid transparent`,
  }),
  borderRoot: ({
    borderVisible,
    borderWidth,
    borderActiveColor = hexRgba(palette.secondary.light, 0.8),
    borderInactiveColor = hexRgba(palette.primary.light, 0.8),
  }) => ({
    border: borderVisible
      ? `${borderWidth}px solid ${borderActiveColor}`
      : `${borderWidth}px solid ${borderInactiveColor}`,
  }),
}))
