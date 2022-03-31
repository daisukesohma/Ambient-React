import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
  loading?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    backgroundColor: palette.common.modalBackground,
    color: palette.text.primary,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: 8,
    '&:focus': {
      outline: 'none',
    },
    fontSize: '12px',
    padding: spacing(2, 2, 2, 2),
    width: '531px',
  },
  title: {
    width: '100%',
    fontSize: 20,
    padding: spacing(0, 0, 3),
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  close: ({ loading }: StyleArguments) => ({
    marginTop: -spacing(0.5),
    cursor: loading ? 'inherit' : 'pointer',
    '&:hover': {
      color: loading ? 'inherit' : palette.primary.main,
    },
  }),
}))
