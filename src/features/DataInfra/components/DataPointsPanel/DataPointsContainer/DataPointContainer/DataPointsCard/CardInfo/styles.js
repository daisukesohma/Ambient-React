import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ palette }) => ({
  info: {
    alignItems: 'center',
    background: palette.common.black,
    borderRadius: ({ isMini }) => (isMini ? 2.75 : 4),
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.9,
    cursor: 'pointer',
    height: ({ isMini }) => (isMini ? 24 : 36),
    margin: ({ isMini }) => (isMini ? 5.5 : 8),
    width: ({ isMini }) => (isMini ? 24 : 36),
  },
}))
