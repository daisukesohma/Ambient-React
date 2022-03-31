import React from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { Button, CircularProgress } from 'ambient_ui'
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'

import {
  setAnnotationModalOpen,
  updateDataPointEventAnnotationFetchRequested,
  setIsNormalView,
} from '../../../../redux/dataInfraSlice'
import { stringToFailureMode } from '../../utils/index'

import AnnotationView from './AnnotationView'
import useStyles from './styles'

export default function AnnotationModal() {
  const dispatch = useDispatch()
  const darkMode = useSelector(state => state.settings.darkMode)

  const isAnnotationModalOpen = useSelector(
    state => state.dataInfra.isAnnotationModalOpen,
  )
  const getEventAnnotationLoading = useSelector(
    state => state.dataInfra.getEventAnnotationLoading,
  )
  const currentDataPoint = useSelector(
    state => state.dataInfra.currentDataPoint,
  )
  const currentLabel = useSelector(
    state => state.dataInfra.currentEventAnnotationLabel,
  )
  const currentOther = useSelector(
    state => state.dataInfra.currentEventAnnotationOther,
  )
  const currentEventAnnotationFailureModes = useSelector(
    state => state.dataInfra.currentEventAnnotationFailureModes,
  )

  const classes = useStyles({ darkMode })

  const handleClose = () => {
    batch(() => {
      dispatch(setAnnotationModalOpen({ isAnnotationModalOpen: false }))
      dispatch(setIsNormalView({ isNormalView: true }))
    })
  }

  const updateAnnotation = () => {
    const failureModeIds = currentEventAnnotationFailureModes.map(
      failureModeString => stringToFailureMode(failureModeString)[0],
    )
    batch(() => {
      dispatch(
        updateDataPointEventAnnotationFetchRequested({
          dataPointId: currentDataPoint.id,
          label: currentLabel,
          other: currentOther,
          failureModeIds: failureModeIds.length === 0 ? null : failureModeIds,
        }),
      )
      dispatch(setIsNormalView({ isNormalView: true }))
    })
    handleClose()
  }

  return (
    <>
      {!getEventAnnotationLoading ? (
        <div>
          <Dialog
            disableEnforceFocus
            fullWidth={true}
            maxWidth={'lg'}
            open={isAnnotationModalOpen}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
              <Typography className='am-h5'>Annotate Data Point</Typography>
            </DialogTitle>
            <DialogContent classes={{ root: classes.dialogContentRoot }}>
              <AnnotationView />
            </DialogContent>
            <DialogActions classes={{ root: classes.dialogActionsRoot }}>
              <Button variant='outlined' onClick={handleClose} color='primary'>
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={updateAnnotation}
                color='primary'
                autoFocus
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
    </>
  )
}
