import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  selectValue: ({ darkMode, disabled, fitRow }) => ({
    minWidth: disabled ? 64 : 108,
    backgroundColor: darkMode ? palette.grey[800] : palette.grey[50],
    fontSize: 14,
    padding: disabled ? spacing(1, 2, 1, 2) : spacing(1, 1, 1, 2),
    color: darkMode ? palette.grey[100] : palette.grey[700],
    fontWeight: 900,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: spacing(0, 1),
    borderRadius: spacing(0.5),
    cursor: disabled ? 'default' : 'pointer',
    height: fitRow ? '100%' : 40,
    boxSizing: 'border-box',
  }),
  icon: {
    color: palette.grey[700],
  },
  selectLabelValue: {
    whiteSpace: 'nowrap',
  },
  formControlFit: {
    height: '100%',
  },
  labelFit: {
    height: '100%',
  },
  labelWidth: ({ labelWidth }) => ({
    width: labelWidth,
    whiteSpace: 'break-spaces',
  }),
  disabledColor: ({ darkMode }) => ({
    backgroundColor: darkMode ? palette.grey[900] : palette.common.white,
  }),
}))
