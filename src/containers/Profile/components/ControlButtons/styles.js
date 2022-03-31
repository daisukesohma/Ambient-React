import { makeStyles } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'

export default makeStyles(({ spacing, palette }) => ({
  rollback: {
    marginRight: spacing(2),
    '&&': {
      lineHeight: spacing(2),
      padding: spacing(0.5, 2),
    },
  },
  rollbackConfirm: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : palette.error.main,
  }),
  btnContainer: {
    display: 'flex',
    justifyContent: isMobile ? ' space-between' : 'flex-end',
    alignItems: 'center',
    marginBottom: isMobile ? 24 : 0,
  },
  saveBtn: {
    marginLeft: `${spacing(1)} !important`,
  },
  dialogRoot: {
    backdropFilter: 'blur(3px) grayscale(.4)',
  },
  dialogPaper: ({ darkMode }) => ({
    backdropFilter: 'blur(3px)',
    border: darkMode
      ? `1px solid ${palette.grey[700]}`
      : '1px solid transparent',
    background: darkMode ? 'rgba(0,0,0,.6)' : palette.common.white,
  }),
  dialogTitle: ({ darkMode }) => ({
    color: darkMode ? palette.common.white : null,
  }),
  dialogContentText: ({ darkMode }) => ({
    color: darkMode ? palette.grey[300] : null,
  }),
  dialogActionsRoot: {
    paddingBottom: spacing(2),
  },
}))
