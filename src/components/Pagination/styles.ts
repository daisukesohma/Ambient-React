import { makeStyles } from '@material-ui/core/styles'

interface Props {
  isMobile: boolean
  darkMode: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 0,
    borderRadius: '20px',
    '& li': {
      display: 'inline-block',
    },
  },
  page: {
    cursor: 'pointer',
    width: 36,
    height: 36,
    padding: 0,
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageLink: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:focus': {
      outline: 'none',
    },
  },
  active: {
    border: ({ darkMode }: Props) =>
      darkMode ? 'none' : `1px solid ${palette.grey[600]}`,
    backgroundColor: palette.common.white,
    color: palette.common.black,
    borderRadius: '50%',
  },
  control: {
    padding: '0 !important',
    cursor: 'pointer',
  },
  controlLink: {
    display: 'flex',
    '&:focus': {
      outline: 'none',
    },
  },
  break: {
    marginBottom: spacing(1),
  },
  manualInput: {
    '& .MuiInput-input': {
      color: ({ darkMode }: Props) =>
        darkMode ? palette.common.white : palette.common.black,
      '&::placeholder': {
        textOverflow: 'ellipsis !important',
        color: ({ darkMode }: Props) =>
          darkMode ? palette.common.white : palette.common.black,
      },
    },
  },
}))
