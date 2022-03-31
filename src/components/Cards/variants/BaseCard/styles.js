import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({
    darkMode,
    fullWidth,
    width,
    height,
    size,
    hoverColor,
    borderColor,
  }) => {
    const getWidth = () => {
      if (width) {
        return width
      }
      if (fullWidth) {
        return '100%'
      }
      if (size === 'md') {
        return 300
      }
      return 300
    }

    const getHeight = () => {
      if (size === 'md') {
        return 319
      }
      if (height) {
        return height
      }
      return 319
    }

    const getHover = () => {
      if (hoverColor === 'red') {
        return {
          border: `1px solid ${palette.error.main}`,
          boxShadow: '0px 0px 15px rgba(253, 35, 92, 0.5)',
        }
      }
      if (hoverColor === 'blue') {
        return {
          border: `1px solid ${palette.primary[200]}`,
        }
      }
      return {}
    }
    return {
      width: getWidth(),
      height: getHeight(),
      borderRadius: 4,
      border: `1px solid ${borderColor}`,
      background: darkMode ? palette.common.black : palette.common.white,
      boxSizing: 'border-box',
      boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)', // shadows.soft,
      position: 'relative',
      '&:hover': getHover(),
    }
  },
}))
