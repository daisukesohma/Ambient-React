import { makeStyles } from '@material-ui/core/styles'

import { TIMELINE } from '../../../../constants'

export default makeStyles(theme => ({
  root: ({ isInCatalog }) => ({
    background: theme.palette.grey[900],
    border: `solid 1px ${
      isInCatalog ? theme.palette.primary.main : 'transparent'
    }`,
    opacity: 0.9,
    position: 'absolute',
    bottom:
      TIMELINE.container.height + TIMELINE.controls.height + theme.spacing(1),
    boxSizing: 'border-box',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0, 0.5),
    boxShadow: '0 0 10px 0 rgb(0, 0, 0)',
  }),
  img: {
    width: '100%',
    marginTop: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  label: {
    marginLeft: theme.spacing(1),
  },
  zapIcon: {
    position: 'relative',
    left: theme.spacing(0.5),
    top: theme.spacing(0.5),
    height: theme.spacing(3),
  },
  curveIcon: {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: theme.palette.common.black,
  },
  motionWrapper: {
    padding: theme.spacing(0.5, 0),
  },
  loader: {
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    position: 'absolute',
  },
  details: {
    marginTop: theme.spacing(1),
  },
  snapshot: {
    position: 'relative',
  },
}))
