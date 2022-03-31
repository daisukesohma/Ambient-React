import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
// src
import { SettingsSliceProps } from 'redux/slices/settings'

import { fetchThreatSignaturesRequested } from './redux/eventAnnotationPortalSlice'
import AnnotationModal from './components/AnnotationContainer'
import useStyles from './styles'

export default function EventAnnotationPortal(): JSX.Element {
  const dispatch = useDispatch()
  const darkMode = useSelector(
    (state: SettingsSliceProps) => state.settings.darkMode,
  )
  const classes = useStyles({ darkMode })
  const { dataPointId }: { dataPointId: string | undefined } = useParams()

  // Get campaign data
  useEffect(() => {
    dispatch(fetchThreatSignaturesRequested({ dataPointId }))
  }, [dispatch, dataPointId])

  return (
    <div className={classes.container}>
      <AnnotationModal />
    </div>
  )
}
