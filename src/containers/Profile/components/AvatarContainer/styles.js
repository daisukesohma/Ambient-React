import { makeStyles } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'

export default makeStyles(({ spacing, palette }) => ({
  container: ({ darkMode }) => ({
    background: darkMode ? palette.grey[800] : palette.common.white,
    border: darkMode
      ? `1px solid ${palette.grey[600]}`
      : '1px solid transparent',
    boxShadow: '0px 1px 50px rgba(98, 100, 105, 0.15)',
    borderRadius: spacing(0.5),
    marginBottom: spacing(3),
    padding: spacing(3),
  }),
  avatarInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: isMobile ? 0 : spacing(1),
    alignItems: isMobile ? 'center' : 'flex-start',
    marginTop: isMobile ? spacing(2) : 0,
  },
  avatarName: ({ darkMode }) => ({
    marginBottom: spacing(1),
    color: darkMode ? palette.grey[300] : 'inherit',
  }),
  subText: ({ darkMode }) => ({
    color: palette.grey[darkMode ? 500 : 700],
  }),
  editText: {
    color: palette.grey[300],
  },
  avatarRoot: {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'center' : 'unset',
  },
  passChangeBtn: {
    '&&': {
      marginTop: spacing(1),
      backgroundColor: `${palette.common.black}`,
      lineHeight: '14px',
      padding: spacing(0.5, 2),
    },
  },
}))
