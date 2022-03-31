import { makeStyles } from '@material-ui/core/styles'
import hexRgb from 'hex-rgb'

// converts hex to rgba string (so we don't need to manually retrieve rgb values for colors)
const convertHexToRgba = (hex, alpha) => {
  const rgb = hexRgb(hex)
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${alpha})`
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  levelLabel: {
    borderRadius: spacing(0.5),
    height: '1.1em',
    margin: spacing(0, 1),
    padding: spacing(0.25, 0.5, 0.25, 0.75),
    textTransform: 'uppercase',
    mixBlendMode: 'normal',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
  },
  levelColor: ({ level, darkMode }) => {
    if (darkMode) {
      if (level === 'high') {
        return {
          background: convertHexToRgba(palette.error.main, 0.7),
          color: palette.common.errorLightPinkLight,
        }
      }
      if (level === 'medium') {
        return {
          background: convertHexToRgba(palette.warning.main, 0.7),
          color: palette.grey[200],
        }
      }
      if (level === 'low') {
        return {
          background: convertHexToRgba(palette.primary[500], 0.7),
          color: palette.primary[50],
        }
      }
    }

    if (level === 'high') {
      return {
        background: palette.error.light,
        color: palette.error.main,
      }
    }
    if (level === 'medium') {
      return {
        background: palette.warning.light,
        color: palette.grey[700],
      }
    }
    if (level === 'low') {
      return {
        background: palette.primary[50],
        color: palette.primary[500],
      }
    }
    return {}
  },
}))
