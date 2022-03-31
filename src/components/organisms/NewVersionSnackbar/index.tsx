import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
// src
import { useInterval } from 'common/hooks'

import {
  fetchProductInfoRequested,
  VersionSliceProps,
  setVersion,
} from './redux/versionSlice'

const INTERVAL = 900_000 // 15 min

export default function NewVersionSnackbar(): JSX.Element {
  const dispatch = useDispatch()

  const currentRevision = useSelector(
    (state: VersionSliceProps) => state.version.currentRevision,
  )

  const revision = useSelector(
    (state: VersionSliceProps) => state.version.revision,
  )

  const newVersionDetected = currentRevision !== revision

  useEffect(() => {
    dispatch(fetchProductInfoRequested({ initialLoad: true }))
  }, [dispatch])

  useInterval(() => {
    if (!newVersionDetected)
      dispatch(fetchProductInfoRequested({ initialLoad: false }))
  }, INTERVAL)

  const handleClose = (): void => {
    dispatch(setVersion({ revision }))
  }

  const handleRefresh = (): void => {
    dispatch(setVersion({ revision }))
    window.location.reload()
  }

  const action = (
    <>
      <Button color='secondary' size='small' onClick={handleRefresh}>
        UPDATE
      </Button>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </>
  )

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={newVersionDetected}
      message='There is a new version of the product. Click to pull latest update:'
      action={action}
    />
  )
}
