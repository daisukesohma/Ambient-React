import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: ({ isHover, darkMode }) => {
    const getBorderColor = () => {
      if (isHover) {
        return palette.error.main
      }
      if (darkMode) {
        return palette.grey[800]
      }
      return palette.grey[300]
    }

    return {
      width: '100%',
      borderRadius: 4,
      background: darkMode ? palette.common.black : palette.common.white,
      border: `1px solid ${getBorderColor()}`,
      boxSizing: 'border-box',
      boxShadow: isHover ? '0px 0px 15px rgba(253, 35, 92, 0.5)' : null,
    }
  },
  gifContainer: {
    display: 'flex',
    position: 'relative',
  },
}))
