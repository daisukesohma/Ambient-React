import { makeStyles } from '@material-ui/core/styles'

const WIDTH_START = 300
const WIDTH_END = 450
const WIDTH_DIFF = WIDTH_END - WIDTH_START

export default makeStyles(({ spacing, palette, transitions }) => ({
  containerRoot: ({ isMobileOnly }) => ({
    // width: isMobileOnly ? '100%' : 'auto',
    // marginLeft: isMobileOnly ? 0 : WIDTH_DIFF,
    // marginRight: isMobileOnly ? 0 : spacing(3),
    // marginTop: isMobileOnly ? spacing(1) : 0,
    // marginBottom: isMobileOnly ? spacing(1) : 0,
  }),
  container: ({ darkMode }) => ({
    width: '100%',
    // background: darkMode
    //   ? theme.palette.common.black
    //   : theme.palette.common.white,
    // border: `1px solid ${palette.grey[darkMode ? 800 : 100]}`,
    border: `1px solid ${palette.border.default}`,
    borderRadius: spacing(3),
    // '&:hover': {
    //   background: darkMode ? 'rgba(0,0,0,.3)' : theme.palette.grey[50],
    //   border: `1px solid ${theme.palette.grey[darkMode ? 100 : 400]}`,
    // },
  }),
  input: {
    fontSize: 16,
    padding: spacing(0.5, 1),
    width: '100%',
  },
  // used  { [classes.darkMode]: darkMode}) syntax because changing color within 'input' and 'container'
  // was having issues when toggling back and fortch between dark and light mode, this is an easier better solution that works every time
  // darkMode: {
  //   color: theme.palette.common.white,
  // },
  searchIcon: {
    color: palette.text.secondary,
  },
  closeIcon: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  option: {
    '&:hover': {
      background: palette.text.secondary,
    },
  },
  optionRoot: {
    color: 'red',
  },
  popperRoot: {
    // background: palette.grey[800],
  },
  root: {
    width: '100%',
    backdropFilter: 'blur(3px)',
  },
  focused: ({ isMobileOnly }) => ({
    width: isMobileOnly ? '100%' : WIDTH_END,
    animation: isMobileOnly
      ? `$expandFocused .1s ${transitions.easing.easeInOut} both`
      : 'none',
  }),
  '@keyframes expandFocused': {
    '0%': {
      width: WIDTH_START,
    },
    '100%': {
      width: WIDTH_END,
    },
  },
  groupRoot: {
    // color: palette.grey[600],
  },
  divider: {
    // background: palette.grey[600],
  },
}))
