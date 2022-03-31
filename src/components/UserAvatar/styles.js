import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  root: ({ background, size }) => {
    const defaultSize = 34
    if (size === 'sm') {
      return {
        background,
        height: 28,
        width: 28,
      }
    }
    if (size === 'md') {
      return {
        background,
        height: defaultSize,
        width: defaultSize,
      }
    }
    if (typeof size === 'number') {
      return {
        background,
        height: size,
        width: size,
      }
    }

    return {
      background,
      height: defaultSize,
      width: defaultSize,
    }
  },
  nameLetter: ({ size }) => {
    const defaultSize = 19
    if (size === 'sm') {
      return {
        fontSize: 16,
      }
    }
    if (size === 'md') {
      return {
        fontSize: defaultSize,
      }
    }
    if (typeof size === 'number') {
      return {
        fontSize: size / 1.75,
      }
    }
    return {
      fontSize: defaultSize,
    }
  },
}))
