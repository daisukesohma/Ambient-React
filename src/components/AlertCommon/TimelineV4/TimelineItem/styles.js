import { makeStyles } from '@material-ui/core/styles'
import { hexRgba } from 'utils'

export default makeStyles(({ spacing, palette }) => ({
  chatBox: {
    borderRadius: 18,
    padding: spacing(1, 1.5),
    border: `1px solid ${hexRgba(palette.primary.light, 0.5)}`,
  },
  timeLineItem: {
    position: 'relative',
    padding: spacing(1.25, 2),
    overflow: 'hidden',
    borderBottom: `1px solid ${palette.grey[700]}`,
  },
  noWrapGrid: {
    flexWrap: 'nowrap',
  },
  manageIcons: {
    position: 'absolute',
    right: spacing(2.5),
    cursor: 'pointer',
  },
  timelineContact: {
    display: 'flex',
    marginTop: spacing(0.25),
  },
  timelineContactMethod: {
    margin: spacing(0.5, 0.5, 0, 0),
  },
  timelineContactName: {
    margin: spacing(0.5, 0, 0, 0.5),
  },
}))
