import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

const useFlexStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerAround: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  centerStart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerEnd: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  columnCenterStart: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  startAll: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
}))

const useCursorStyles = makeStyles(({ palette }) => ({
  clickableText: {
    '&:hover': {
      color: palette.primary.main,
    },
  },
}))

const useTextStyles = makeStyles(theme => ({
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(1),
  },
}))

const useFuturisticStyles = makeStyles(() => ({
  iceSheet: {
    background: 'rgba(24, 129, 255, 0.12)',
    border: '1px solid rgba(24, 129, 255, 0.12)',
  },
}))

const useIconButtonStyles = makeStyles(({ palette }) => ({
  root: ({ iconSelected }) => ({
    background: palette.common.black,
    color: iconSelected ? hexRgba(palette.error.main, 0.8) : palette.grey[700],
    transition: 'background 10ms cubic-bezier(1,0,0,1) 0ms',
    '&:hover': {
      background: palette.grey[800],
    },
    border: iconSelected
      ? `1px solid ${hexRgba(palette.primary.main, 0.7)}`
      : 'none',
  }),
}))

export {
  useCursorStyles,
  useFlexStyles,
  useFuturisticStyles,
  useIconButtonStyles,
  useTextStyles,
}
