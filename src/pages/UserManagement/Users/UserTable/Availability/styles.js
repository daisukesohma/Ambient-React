import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  root: {
    color: ({ availability }) => {
      let color
      if (availability === 'Checked In') {
        color = palette.secondary.main
      } else if (availability === 'Unavailable') {
        color = palette.grey[500]
      } else {
        color = palette.grey[300]
      }
      return color
    },
    display: 'flex',
    alignItems: 'center',
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 8,
    backgroundColor: ({ availability }) =>
      availability === 'Checked In'
        ? palette.secondary.main
        : palette.grey[500],
  },
}))
