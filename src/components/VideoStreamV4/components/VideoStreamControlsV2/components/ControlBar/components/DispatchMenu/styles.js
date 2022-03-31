import { makeStyles } from '@material-ui/core/styles'

import { TIMELINE } from '../../../../constants'

const WIDTH = 240
export default makeStyles(({ spacing, palette }) => ({
  dispatchMenuComponent: {
    backgroundColor: palette.grey[900],
    border: `1px solid ${palette.grey[700]}`,
    color: 'white',
    borderRadius: spacing(0.5),
    bottom: TIMELINE.controls.height + TIMELINE.container.height + 8,
    transform: 'translate(calc(-50% - 32px))',
    padding: spacing(1),
    position: 'absolute',
    width: WIDTH,
  },
  dispatchMenuComponentRow: {
    padding: 4,
    display: 'flex',
  },
  customTimeLabel: {
    display: 'flex',
  },
  save: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
  time: {
    color: palette.grey[500],
  },
  manualTime: {
    color: palette.common.greenNeon,
  },
  textInputRoot: {
    '& input': {
      color: 'white',
    },
    '& label': {
      color: palette.grey[500],
      fontSize: 12,
      fontFamily: 'Aeonik',
    },
  },
}))
