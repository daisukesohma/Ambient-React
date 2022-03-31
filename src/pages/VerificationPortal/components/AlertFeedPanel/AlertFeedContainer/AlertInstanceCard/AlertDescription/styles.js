import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing }) => ({
  root: ({ isMini }) => ({
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    boxSizing: 'border-box',
    nimHeight: isMini ? 66 : 88,
    padding: isMini ? spacing(1.5, 1) : spacing(1.5, 1.25, 1.5, 2),
  }),
  rowSpace: {
    marginBottom: spacing(0.75),
  },
  copyLinkSpaces: {
    marginLeft: spacing(0.5),
    marginBottom: spacing(0.75),
  },

  miniLabel: {
    height: '100%',
    margin: 0,
    padding: spacing(0, 0.5, 0, 0.5),
    borderRadius: 2,
  },

  evaluatorDetails: {
    marginLeft: spacing(0.75),
  },
}))
