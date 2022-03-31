import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  root: ({ darkMode, isMini }) => ({
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    boxSizing: 'border-box',
    color: darkMode ? 'white' : 'black',
    display: 'flex',
    flexDirection: 'column',
    nimHeight: isMini ? 66 : 88,
    justifyContent: 'space-evenly',
    padding: isMini ? '12px 8px' : '15px 33px 12px 16px',
  }),
  descriptionRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}))
