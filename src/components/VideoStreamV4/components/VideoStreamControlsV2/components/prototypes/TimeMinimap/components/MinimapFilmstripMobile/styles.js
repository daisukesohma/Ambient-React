import { makeStyles } from '@material-ui/core/styles'

import { FILMSTRIP_HEIGHT } from '../../../constants'

const Z_INDICES = {
  border: 10,
  dragContainer: 20,
  leftGrab: 21,
  rightGrab: 21,
}

const useStyles = makeStyles(theme => ({
  border: ({ minimapWidth, minimapLeftX }) => ({
    boxSizing: 'border-box',
    border: '2px solid yellow',
    position: 'absolute',
    top: 0,
    left: minimapLeftX,
    height: FILMSTRIP_HEIGHT,
    width: minimapWidth,
    zIndex: Z_INDICES.border,
  }),
  dragContainer: {
    width: '100vw',
    background: 'transparent',
    position: 'absolute',
    boxSizing: 'border-box',
    overflow: 'hidden',
    height: FILMSTRIP_HEIGHT,
    zIndex: Z_INDICES.dragContainer,
    top: 0,
  },
  leftGrab: ({ minimapLeftX }) => ({
    cursor: 'pointer',
    background: 'rgba(256,256,256, .3)', // 'transparent',
    position: 'absolute',
    left: minimapLeftX,
    width: 50,
    height: FILMSTRIP_HEIGHT,
    top: 0,
    zIndex: Z_INDICES.leftGrab,
    '&:hover': {
      background: 'rgba(256,256,256, .5)',
    },
  }),
  rightGrab: ({ minimapRightX }) => ({
    cursor: 'pointer',
    background: 'rgba(256,256,256, .3)', // 'transparent',
    position: 'absolute',
    left: minimapRightX - 50,
    width: 50,
    height: FILMSTRIP_HEIGHT,
    top: 0,
    zIndex: Z_INDICES.rightGrab,
    '&:hover': {
      background: 'rgba(256,256,256, .5)',
    },
  }),
  snapshotContainer: {
    width: '100vw',
    background: 'transparent',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  snapshot: {
    height: FILMSTRIP_HEIGHT,
    zIndex: 2,
  },
}))

export default useStyles
