import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(({ spacing, palette }) => ({
  root: {
    width: '80vw',
    display: 'block',
  },
  title: {
    paddingBottom: `${spacing(0.5)}px !important`,
  },
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
  border: {
    border: `1px solid ${palette.grey[500]}`,
    borderRadius: spacing(0.5),
    padding: spacing(1),
    width: '100%',
  },
  dataTable: {
    paddingTop: `${spacing(0.5)}px !important`,
  },
}))
