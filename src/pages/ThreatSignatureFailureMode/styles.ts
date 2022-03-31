import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  filterTitle: {
    marginRight: spacing(1),
    marginTop: spacing(1),
    fontSize: spacing(1.75),
  },
  filterDropdown: {
    marginRight: spacing(1),
  },
  additionalTools: {
    display: 'flex',
  },
  failureModeContainer: {
    position: 'fixed',
    overflow: 'auto',
    border: `1px solid ${palette.grey[500]}`,
    padding: spacing(1),
    borderRadius: spacing(0.5),
    maxHeight: '75%',
    marginRight: spacing(1),
  },
  failureModeBox: {
    display: 'block',
    overflowY: 'scroll',
  },
  failureMode: {
    padding: spacing(0.5),
    float: 'left',
  },
  border: {
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: spacing(0.5),
    padding: spacing(1),
  },
  datePicker: {
    paddingLeft: spacing(2),
    display: 'flex',
  },
  datePickerLabel: {
    paddingTop: spacing(1),
    paddingRight: spacing(1),
  },
}))
