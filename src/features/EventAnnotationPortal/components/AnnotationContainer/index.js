import React from 'react'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import map from 'lodash/map'
import { Button, CircularProgress, SearchableSelectDropdown } from 'ambient_ui'
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core'
import MultiSelect from 'ambient_ui/components/menus/MultiSelect'

import {
  dataPointToAnnotateFetchRequested,
  getDataPointFetchRequested,
  updateDataPointEventAnnotationFetchRequested,
  pushToPreviousDataPointIds,
  popPreviousDataPointIds,
  setIsNormalView,
  setSelectedThreatSignatures,
  setSelectedLabel,
} from '../../redux/eventAnnotationPortalSlice'
import { stringToFailureMode } from '../utils/index'

import AnnotationView from './AnnotationView'
import useStyles from './styles'
import find from 'lodash/find'
import CopyLink from 'components/CopyLink'

function AnnotationModal() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { dataPointId } = useParams()
  const darkMode = useSelector(state => state.settings.darkMode)
  const classes = useStyles({ darkMode })

  const getDataPointToAnnotateLoading = useSelector(
    state => state.eventAnnotationPortal.getDataPointToAnnotateLoading,
  )
  const threatSignaturesLoading = useSelector(
    state => state.eventAnnotationPortal.threatSignaturesLoading,
  )
  const currentDataPointId = useSelector(
    state => state.eventAnnotationPortal.currentDataPointId,
  )
  const currentLabel = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationLabel,
  )
  const currentOther = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationOther,
  )
  const currentEventAnnotationFailureModes = useSelector(
    state => state.eventAnnotationPortal.currentEventAnnotationFailureModes,
  )
  const previousDataPointIds = useSelector(
    state => state.eventAnnotationPortal.previousDataPointIds,
  )

  const allThreatSignatures = useSelector(
    state => state.eventAnnotationPortal.allThreatSignatures,
  )

  const selectedThreatSignatures = useSelector(
    state => state.eventAnnotationPortal.selectedThreatSignatures,
  )

  const selectedLabel = useSelector(state => state.eventAnnotationPortal.label)

  const updateAnnotation = () => {
    // to remove the data point link from url
    if (dataPointId) {
      history.push('/internal/data-infrastructure/annotate')
    }
    const failureModeIds = currentEventAnnotationFailureModes.map(
      failureModeString => stringToFailureMode(failureModeString)[0],
    )
    const threatSignatureIds = map(selectedThreatSignatures, 'value')

    batch(() => {
      dispatch(
        pushToPreviousDataPointIds({
          dataPointId: currentDataPointId,
        }),
      )
      dispatch(
        updateDataPointEventAnnotationFetchRequested({
          dataPointId: currentDataPointId,
          label: currentLabel,
          other: currentOther,
          failureModeIds: failureModeIds.length === 0 ? null : failureModeIds,
        }),
      )
      dispatch(
        dataPointToAnnotateFetchRequested({
          threatSignatureIds,
          label: selectedLabel,
        }),
      )
      dispatch(setIsNormalView({ isNormalView: false }))
    })
  }

  const handleNext = () => {
    // to remove the data point link from url
    if (dataPointId) {
      history.push('/internal/data-infrastructure/annotate')
    }
    const threatSignatureIds = map(selectedThreatSignatures, 'value')
    batch(() => {
      dispatch(setIsNormalView({ isNormalView: false }))
      dispatch(
        pushToPreviousDataPointIds({
          dataPointId: currentDataPointId,
        }),
      )
      dispatch(
        dataPointToAnnotateFetchRequested({
          threatSignatureIds,
          label: selectedLabel,
        }),
      )
    })
  }

  const handleBack = () => {
    const previousDataPointId =
      previousDataPointIds[previousDataPointIds.length - 1]
    batch(() => {
      dispatch(setIsNormalView({ isNormalView: false }))
      dispatch(popPreviousDataPointIds())
      dispatch(
        getDataPointFetchRequested({
          dataPointId: previousDataPointId,
        }),
      )
    })
  }

  const refreshAnnotation = () => {
    // to remove the data point link from url
    if (dataPointId) {
      history.push('/internal/data-infrastructure/annotate')
    }
    const threatSignatureIds = map(selectedThreatSignatures, 'value')
    batch(() => {
      dispatch(setIsNormalView({ isNormalView: false }))
      dispatch(
        dataPointToAnnotateFetchRequested({
          threatSignatureIds,
          label: selectedLabel,
        }),
      )
    })
  }

  const threatSignatureOptions = map(allThreatSignatures, ({ name, id }) => ({
    label: name,
    value: id,
  }))

  const labelOptions = [
    {
      label: 'Positive',
      value: true,
    },
    {
      label: 'Negative',
      value: false,
    },
    {
      label: 'All',
      value: null,
    },
  ]

  return (
    <>
      {!getDataPointToAnnotateLoading && !threatSignaturesLoading ? (
        <div>
          <Dialog
            disableEnforceFocus
            fullWidth={true}
            maxWidth={'lg'}
            open={!getDataPointToAnnotateLoading}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            classes={{ paper: classes.dialogRoot }}
          >
            <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
              <Grid
                container
                spacing={1}
                justify='space-between'
                className={classes.title}
              >
                <Typography className='am-h5'>Annotate Data Point</Typography>
                {currentDataPointId !== null && (
                  <CopyLink
                    text={`${window.location.origin}/internal/data-infrastructure/annotate/${currentDataPointId}`}
                    confirmText='Your shareable link has been copied to the clipboard!'
                    tooltipText='Copy shareable link'
                  />
                )}
              </Grid>
              <Grid container spacing={1}>
                <Grid item lg={10} md={9} sm={8} xs={12}>
                  <MultiSelect
                    className={classes.multiSelect}
                    options={threatSignatureOptions}
                    value={selectedThreatSignatures}
                    onChange={e => dispatch(setSelectedThreatSignatures(e))}
                    labelledBy={'ThreatSignaturesSelector'}
                    overrideStrings={{
                      selectSomeItems: 'Filter Threat Signatures',
                      allItemsAreSelected: 'All Threat Signatures Selected',
                      selectAll: 'Select All Threat Signatures',
                      search: 'Search Threat Signatures',
                      clearSearch: 'Clear Threat Signatures',
                    }}
                    darkMode={darkMode}
                  />
                </Grid>
                <Grid item lg={2} md={3} sm={4} xs={12}>
                  <SearchableSelectDropdown
                    options={labelOptions}
                    value={find(labelOptions, ['value', selectedLabel])}
                    onChange={e => dispatch(setSelectedLabel(e.value))}
                    isSearchable={false}
                    className={classes.dropdown}
                  />
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent classes={{ root: classes.dialogContentRoot }}>
              <AnnotationView />
            </DialogContent>
            <DialogActions classes={{ root: classes.dialogActionsRoot }}>
              {previousDataPointIds.length > 0 && (
                <Button variant='outlined' onClick={handleBack} color='primary'>
                  Back
                </Button>
              )}
              {currentDataPointId !== null ? (
                <>
                  <Button
                    variant='contained'
                    onClick={updateAnnotation}
                    color='primary'
                  >
                    Save
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleNext}
                    color='primary'
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant='contained'
                    onClick={() => history.push('/internal')}
                    color='secondary'
                  >
                    Back
                  </Button>
                  <Button
                    variant='contained'
                    onClick={refreshAnnotation}
                    color='primary'
                  >
                    Refresh
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div className={classes.loadingContainer}>
          Loading ... <CircularProgress />
        </div>
      )}
    </>
  )
}

export default AnnotationModal
