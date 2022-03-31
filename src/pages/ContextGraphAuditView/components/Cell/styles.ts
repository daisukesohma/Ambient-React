import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode: boolean
}

export const useStyles = makeStyles(({ spacing, palette }) => ({
  buttonGroup: {
    width: '100%',
    height: 36,
  },
  buttonActive: ({ darkMode }: StyleArguments) => ({
    width: '100%',
    height: 36,
    borderRight: `1px solid ${palette.grey[900]} !important`,
    backgroundColor: darkMode ? palette.grey[800] : 'inherit',
    '&:hover': {
      backgroundColor: 'green',
    },
    '&:selected': {
      backgroundColor: 'green',
    },
  }),
  buttonActiveSelected: {
    width: '100%',
    backgroundColor: 'green !important',
  },
  buttonTest: ({ darkMode }: StyleArguments) => ({
    width: '100%',
    height: 36,
    borderLeft: `1px solid ${palette.grey[900]} !important`,
    borderRight: `1px solid ${palette.grey[900]} !important`,
    backgroundColor: darkMode ? palette.grey[800] : 'inherit',
    '&:hover': {
      backgroundColor: 'orange',
    },
    '&:selected': {
      backgroundColor: 'orange',
    },
  }),
  buttonTestSelected: {
    width: '100%',
    backgroundColor: 'orange !important',
  },
  buttonDisabled: ({ darkMode }: StyleArguments) => ({
    width: '100%',
    height: 36,
    borderLeft: `1px solid ${palette.grey[900]} !important`,
    backgroundColor: darkMode ? palette.grey[800] : 'inherit',
    '&:hover': {
      backgroundColor: 'red',
    },
    '&:selected': {
      backgroundColor: 'red',
    },
  }),
  buttonDisabledSelected: {
    width: '100%',
    backgroundColor: 'red !important',
  },
  delete: {
    height: 36,
    width: 36,
  },
  deleteIcon: {
    paddingBottom: spacing(0.5),
    color: palette.error.main,
  },
  revert: {
    paddingBottom: spacing(0.5),
    color: palette.primary.main,
  },
  disabled: {
    color: palette.text.secondary,
  },
  dropdown: {
    display: 'flex',
  },
}))
