import { makeStyles } from '@material-ui/core/styles'

// maybe make min and maxwidth constants to import
export const useStyles = makeStyles(theme => ({
  imageContainer: ({ height }) => ({
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    height, // : height - 72 - 51 - 16 - 2, // total height - top - bottom -padding- border
    width: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.common.black,
    borderRadius: 4,
  }),
  image: ({ ratio, height }) => {
    // const smallerHeight = height - 72 - 51 - 16 - 2
    const width = height * ratio
    return {
      width,
      height,
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
}))
