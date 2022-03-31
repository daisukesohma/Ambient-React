import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles(props => ({
  size: ({ size }) => {
    let sized = 32 // default for 'small'
    if (size === 'medium') {
      sized = 40
    }
    if (size === 'large') {
      sized = 48
    }

    return {
      width: sized,
      height: sized,
      minHeight: 'unset',
    }
  },
}))
