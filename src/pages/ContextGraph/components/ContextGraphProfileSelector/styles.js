import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  wrapper: ({ isMobileOnly, darkMode }) => ({
    height: isMobileOnly ? 'auto' : 80,
    padding: spacing(1),
    // backgroundColor: palette.grey[900],
    boxSizing: 'border-box',
  }),
  box: {
    display: 'flex',
    border: '1px solid',
    borderColor: palette.grey[300],
    paddingLeft: spacing(1),
    padding: `0 ${spacing(1)}px`,
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: spacing(0.5),
    alignItems: 'center',
    cursor: 'pointer',
    '&.active': {
      backgroundColor: palette.primary[100],
    },
  },
  hint: {
    color: palette.text.hint,
  },
  spEditForm: {
    paddingLeft: spacing(0.5),
  },
  securityProfileControlIcon: {
    color: `${palette.primary.main} !important`,
    padding: `${spacing(2)}px !important`,
  },
  createSecurityProfilePopover: {
    boxShadow: '2px -1px 11px 1px #222428',
  },
  modal: {
    position: 'absolute',
    width: '40%',
    left: '30%',
    top: '10%',
    // backgroundColor: 'white',
    padding: spacing(3),
  },
  subtitleText: {
    color: palette.text.secondary,
  },
  graphDropDowns: {
    marginTop: spacing(1),
    minWidth: 250,
  },
  alertPanel: {
    width: '100%',
    padding: spacing(0, 1),
    margin: spacing(1, 1, 0),
  },
  alertText: {
    fontSize: 12,
    lineHeight: '16px',
  },
}))
