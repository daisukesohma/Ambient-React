import { makeStyles } from '@material-ui/core/styles'

interface StyleArguments {
  darkMode?: boolean
  mobile?: boolean
}

export default makeStyles(({ spacing, palette }) => ({
  root: ({ darkMode }: StyleArguments) => ({
    backgroundColor: darkMode ? palette.grey[800] : palette.common.white,
    color: darkMode ? palette.common.white : palette.common.black,
    boxSizing: 'border-box',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: 4,
    '&:focus': {
      outline: 'none',
    },
    fontSize: '12px',
    padding: spacing(1, 1, 1, 1),
    display: 'flex',
    width: 'fit-content',
  }),
  close: ({ darkMode }: StyleArguments) => ({
    background: darkMode ? palette.grey[700] : palette.common.white,
    padding: 0,
    border: '1px solid transparent',
    '&:hover': {
      background: palette.common.black,
    },
  }),
  name: {
    paddingRight: 4,
  },
  rangePopoverRoot: ({ mobile }: StyleArguments) => ({
    display: 'flex',
    marginRight: spacing(2),
    width: mobile ? '100%' : 'auto',
    cursor: 'pointer',
  }),
  dateTimeLabel: ({ darkMode }: StyleArguments) => ({
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
    color: darkMode ? palette.grey[50] : palette.grey[800],
    borderRadius: 4,
    outline: 'none',
  }),
  datetime: {
    flex: 1,
    padding: '0 8px',
  },
}))
